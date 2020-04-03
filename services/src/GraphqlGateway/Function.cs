using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace GraphqlGateway
{

    public class Function
    {


        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {
            var server = new Server();
            var errJson = JsonConvert.SerializeObject(new Dictionary<string, string> {
                {"error", "Please define a query"}
            });
            var queryKey = "query";
            var query = "";
            if(apigProxyEvent.QueryStringParameters != null && apigProxyEvent.QueryStringParameters.Keys.Contains(queryKey)) {
                query = apigProxyEvent.QueryStringParameters[queryKey];
            }
            var json = string.IsNullOrEmpty(query) ? errJson : await server.QueryAsync(query);

            return new APIGatewayProxyResponse
            {
                Body = json,
                StatusCode = 200,
                Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
            };
        }
    }
}
