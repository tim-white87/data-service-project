using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Messages.Models;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;

namespace Messages.Controllers
{
  /// <summary>
  /// ASP.NET Core controller to store message data in S3.
  /// </summary>
  [Route("messages/api/v1/[controller]")]
  [Authorize]
  public class MessagesController : ControllerBase
  {
    IAmazonS3 S3Client { get; set; }
    ILogger Logger { get; set; }

    string BucketName { get; set; }
    string UserId { get { return User.FindFirst(ClaimTypes.NameIdentifier)?.Value; } }

    public MessagesController(IConfiguration configuration, ILogger<MessagesController> logger, IAmazonS3 s3Client)
    {
      Logger = logger;
      S3Client = s3Client;
      BucketName = configuration[Startup.AppS3BucketKey];
      if (string.IsNullOrEmpty(BucketName))
      {
        logger.LogCritical("Missing configuration for S3 bucket. The AppS3Bucket configuration must be set to a S3 bucket.");
        throw new Exception("Missing configuration for S3 bucket. The AppS3Bucket configuration must be set to a S3 bucket.");
      }

      logger.LogInformation($"Configured to use bucket {BucketName}");
    }

    [HttpGet]
    public async Task<JsonResult> Get()
    {
      var keys = await S3Client.GetAllObjectKeysAsync(BucketName, UserId, new Dictionary<string, object> { });

      try
      {
        var tasks = new List<Task<GetObjectResponse>>();
        foreach (var key in keys)
        {
          tasks.Add(S3Client.GetObjectAsync(new GetObjectRequest
          {
            BucketName = BucketName,
            Key = key
          }));
        }
        Task.WaitAll(tasks.ToArray());
        var models = new List<MessageModel> { };
        foreach (var task in tasks)
        {
          StreamReader reader = new StreamReader(task.Result.ResponseStream);
          string rawJson = reader.ReadToEnd();
          var model = JsonSerializer.Deserialize<MessageModel>(rawJson);
          var k = task.Result.Key.Split('/');
          model.Key = k[k.Length - 1];
          models.Add(model);
        }
        Response.ContentType = "text/json";
        return new JsonResult(models);
      }
      catch (AmazonS3Exception e)
      {
        Response.StatusCode = (int)e.StatusCode;
        return new JsonResult(e.Message);
      }
    }

    [HttpGet("{key}")]
    public async Task Get(string key)
    {
      key = $"{UserId}/{key}";
      try
      {
        var getResponse = await S3Client.GetObjectAsync(new GetObjectRequest
        {
          BucketName = BucketName,
          Key = key
        });

        Response.ContentType = getResponse.Headers.ContentType;
        getResponse.ResponseStream.CopyTo(Response.Body);
      }
      catch (AmazonS3Exception e)
      {
        Response.StatusCode = (int)e.StatusCode;
        var writer = new StreamWriter(Response.Body);
        writer.Write(e.Message);
      }
    }

    [HttpPost]
    public async Task Post([FromBody]MessageModel model)
    {
      var stream = new MemoryStream(ASCIIEncoding.Default.GetBytes(JsonSerializer.Serialize(model)));
      await Request.Body.CopyToAsync(stream);
      stream.Position = 0;
      try
      {
        var key = $"{UserId}/{DateTime.Now.Ticks}.json";
        await S3Client.UploadObjectFromStreamAsync(
          BucketName,
          key,
          stream,
          new Dictionary<string, object> { });
        Logger.LogInformation($"Uploaded object {key} to bucket {BucketName}");
      }
      catch (AmazonS3Exception e)
      {

        Response.StatusCode = (int)e.StatusCode;
        var writer = new StreamWriter(Response.Body);
        writer.Write(e.Message);
      }
    }

    [HttpPut("{key}")]
    public async Task Put(string key)
    {
      key = $"{UserId}/{key}";
      // Copy the request body into a seekable stream required by the AWS SDK for .NET.
      var seekableStream = new MemoryStream();
      await Request.Body.CopyToAsync(seekableStream);
      seekableStream.Position = 0;

      var putRequest = new PutObjectRequest
      {
        BucketName = BucketName,
        Key = key,
        InputStream = seekableStream
      };

      try
      {
        var response = await S3Client.PutObjectAsync(putRequest);
        Logger.LogInformation($"Uploaded object {key} to bucket {BucketName}. Request Id: {response.ResponseMetadata.RequestId}");
      }
      catch (AmazonS3Exception e)
      {
        Response.StatusCode = (int)e.StatusCode;
        var writer = new StreamWriter(Response.Body);
        writer.Write(e.Message);
      }
    }

    [HttpDelete("{key}")]
    public async Task Delete(string key)
    {
      key = $"{UserId}/{key}";
      var deleteRequest = new DeleteObjectRequest
      {
        BucketName = BucketName,
        Key = key,
      };

      try
      {
        var response = await S3Client.DeleteObjectAsync(deleteRequest);
        Logger.LogInformation($"Deleted object {key} from bucket {BucketName}. Request Id: {response.ResponseMetadata.RequestId}");
      }
      catch (AmazonS3Exception e)
      {
        Response.StatusCode = (int)e.StatusCode;
        var writer = new StreamWriter(Response.Body);
        writer.Write(e.Message);
      }
    }
  }
}
