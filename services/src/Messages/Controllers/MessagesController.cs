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
    public class MessagesController : ControllerBase
    {
        IAmazonS3 S3Client { get; set; }
        ILogger Logger { get; set; }

        string BucketName { get; set; }

        public MessagesController(IConfiguration configuration, ILogger<MessagesController> logger, IAmazonS3 s3Client)
        {
            this.Logger = logger;
            this.S3Client = s3Client;

            this.BucketName = configuration[Startup.AppS3BucketKey];
            if(string.IsNullOrEmpty(this.BucketName))
            {
                logger.LogCritical("Missing configuration for S3 bucket. The AppS3Bucket configuration must be set to a S3 bucket.");
                throw new Exception("Missing configuration for S3 bucket. The AppS3Bucket configuration must be set to a S3 bucket.");
            }

            logger.LogInformation($"Configured to use bucket {this.BucketName}");
        }

        [HttpGet]
        [Authorize]
        public async Task<JsonResult> Get()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var listResponse = await this.S3Client.ListObjectsV2Async(new ListObjectsV2Request
            {
                BucketName = BucketName,
                Prefix = userId
            });

            try
            {
                this.Response.ContentType = "text/json";
                return new JsonResult(listResponse.S3Objects);
            }
            catch(AmazonS3Exception e)
            {
                this.Response.StatusCode = (int)e.StatusCode;
                return new JsonResult(e.Message);
            }
        }

        [HttpGet("{key}")]
        [Authorize]
        public async Task Get(string key)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            try
            {
                var getResponse = await this.S3Client.GetObjectAsync(new GetObjectRequest
                {
                    BucketName = this.BucketName,
                    Key = $"{userId}/${key}"
                });

                this.Response.ContentType = getResponse.Headers.ContentType;
                getResponse.ResponseStream.CopyTo(this.Response.Body);
            }
            catch (AmazonS3Exception e)
            {
                this.Response.StatusCode = (int)e.StatusCode;
                var writer = new StreamWriter(this.Response.Body);
                writer.Write(e.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task Post([FromBody]MessageModel model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var stream = new MemoryStream(ASCIIEncoding.Default.GetBytes(JsonSerializer.Serialize(model)));
            await this.Request.Body.CopyToAsync(stream);
            stream.Position = 0;
            try
            {
                var key = $"{userId}/{DateTime.Now.Ticks}.json";
                await S3Client.UploadObjectFromStreamAsync(
                    BucketName,
                    key,
                    stream,
                    new Dictionary<string, object>{});
                Logger.LogInformation($"Uploaded object {key} to bucket {BucketName}");
            }
            catch (AmazonS3Exception e)
            {
                this.Response.StatusCode = (int)e.StatusCode;
                var writer = new StreamWriter(this.Response.Body);
                writer.Write(e.Message);
            }
        }

        [HttpPut("{key}")]
        public async Task Put(string key)
        {
            // Copy the request body into a seekable stream required by the AWS SDK for .NET.
            var seekableStream = new MemoryStream();
            await this.Request.Body.CopyToAsync(seekableStream);
            seekableStream.Position = 0;

            var putRequest = new PutObjectRequest
            {
                BucketName = this.BucketName,
                Key = key,
                InputStream = seekableStream
            };

            try
            {
                var response = await this.S3Client.PutObjectAsync(putRequest);
                Logger.LogInformation($"Uploaded object {key} to bucket {this.BucketName}. Request Id: {response.ResponseMetadata.RequestId}");
            }
            catch (AmazonS3Exception e)
            {
                this.Response.StatusCode = (int)e.StatusCode;
                var writer = new StreamWriter(this.Response.Body);
                writer.Write(e.Message);
            }
        }

        [HttpDelete("{key}")]
        public async Task Delete(string key)
        {
            var deleteRequest = new DeleteObjectRequest
            {
                 BucketName = this.BucketName,
                 Key = key
            };

            try
            {
                var response = await this.S3Client.DeleteObjectAsync(deleteRequest);
                Logger.LogInformation($"Deleted object {key} from bucket {this.BucketName}. Request Id: {response.ResponseMetadata.RequestId}");
            }
            catch (AmazonS3Exception e)
            {
                this.Response.StatusCode = (int)e.StatusCode;
                var writer = new StreamWriter(this.Response.Body);
                writer.Write(e.Message);
            }
        }
    }
}
