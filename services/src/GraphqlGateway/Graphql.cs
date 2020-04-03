using GraphQL;
using GraphQL.Types;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GraphqlGateway
{
    public class Server 
  {
    private ISchema schema { get; set; }
    public Server() 
    {
      this.schema = Schema.For(@"
          type Jedi {
            id: ID
            name: String,
            side: String
          }

          input JediInput {
            name: String
            side: String
            id: ID
          }

          type Mutation {
            addJedi(input: JediInput): Jedi
            updateJedi(input: JediInput ): Jedi
            removeJedi(id: ID): String
          }

          type Query {
              jedis: [Jedi]
              jedi(id: ID): Jedi
          }
      ", _ =>
      {
        _.Types.Include<Query>();
        _.Types.Include<Mutation>();
      });

    }

    public async Task<string> QueryAsync(string query) 
    {
      var result = await new DocumentExecuter().ExecuteAsync(_ =>
      {
        _.Schema = schema;
        _.Query = query;
      });

      if(result.Errors != null) {
        return result.Errors[0].Message;
      } else {
        return JsonConvert.SerializeObject(result.Data);
      }
    }
  }

  public class Query
  {
    [GraphQLMetadata("jedis")]
    public IEnumerable<Jedi> GetJedis()
    {
      return StarWarsDB.GetJedis();
    }

    [GraphQLMetadata("jedi")]
    public Jedi GetJedi(int id)
    {
      return StarWarsDB.GetJedis().SingleOrDefault(j => j.Id == id);
    }

    [GraphQLMetadata("hello")]
    public string GetHello()
    {
      return "World";
    }
  }

  public class Mutation
  {
    [GraphQLMetadata("addJedi")]
    public Jedi AddJedi(Jedi  input) 
    {
      return StarWarsDB.AddJedi(input);
    }

    [GraphQLMetadata("updateJedi")]
    public Jedi UpdateJedi(Jedi input)
    {
      return StarWarsDB.AddJedi(input);
    }

    [GraphQLMetadata("removeJedi")]
    public string AddJedi(int id)
    {
      return StarWarsDB.RemoveJedi(id);
    }
  }
}