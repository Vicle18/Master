using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using MiddlewareManager.DataModel;
using Newtonsoft.Json;

namespace MiddlewareManager.Repositories;

public class ContainingElementRepository : IContainingElementRepository
{
    private readonly IConfiguration _config;
    private readonly ILogger<IngressRepository> _logger;
    private GraphQLHttpClient graphQLClient;
    public ContainingElementRepository(IConfiguration config, ILogger<IngressRepository> logger)
    {
        _config = config;
        _logger = logger;
        var url = _config.GetValue<string>("METASTORE_URL");
        _logger.LogDebug("starting {repository} , connecting to metastore: {metastore}", "IngressRepository", url);
        graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
        {
            EndPoint = new Uri(url)
        }, new SystemTextJsonSerializer());
    }
    
    public async Task<string> CreateContainingElement(CreateContainingElementDTO value)
    {
        switch (value.type)
        {
            case "company":
                return await CreateCompany(value);
                break;
            case "plant":
                return await CreatePlant(value);
                break;
            case "area":
                return await CreateArea(value);
                break;
            case "line":
                return await CreateLine(value);
                break;
            case "cell":
                return await CreateCell(value);
                break;
            case "machine":
                return await CreateMachine(value);
                break;
            case "staff":
                return await CreateStaff(value);
                break;
            default:
                throw new ArgumentException($"type {value.type} is not a viable option");
        }
    }

    public async Task<string> AddMachineToCell(AddMachineToCellDto dto)
    {
        var request = new GraphQLRequest
        {
            Query = @"mutation UpdateCells($where: CellWhere, $update: CellUpdateInput) {
                          updateCells(where: $where, update: $update) {
                            cells {
                              id
                            }
                          }
                        }",
            Variables = new
            {
                where = new
                {
                    id = dto.cellId
                },
                update = new
                {
                    machines = new[]
                    {
                        new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id = dto.machineId
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        var response = await graphQLClient.SendMutationAsync<object>(request);
        _logger.LogDebug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating containingElement, got feedback: {feedback}", response.Data);

        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in creating plant, error: {response.Errors}");
        }
        
        return dto.cellId;

    }


    private async Task<string> CreateCompany(CreateContainingElementDTO value)
    {
        throw new NotImplementedException();
    }

    private async Task<string> CreatePlant(CreateContainingElementDTO value)
    {
        _logger.LogDebug("creating plant with information: {information}", JsonConvert.SerializeObject(value));
        var id = Guid.NewGuid().ToString();
        var request = new GraphQLRequest
        {
            Query = @"
                            mutation Mutation($input: [PlantCreateInput!]!, $where: CompanyWhere, $update: CompanyUpdateInput) {
                                createPlants(input: $input) {
                                    plants {
                                        id
                                    }
                                }
                                updateCompanies(where: $where, update: $update) {
                                    companies {
                                      name
                                    }
                                }
                            }",
            Variables = new
            {
                input = new[]
                {
                    new
                    {
                        id = id,
                        name = value.name,
                        description = value.description,
                        areas = new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id_IN = value.children
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                where = new
                {
                    id = value.parent
                },
                update = new 
                {
                    plants = new[]
                    {
                        new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id = id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        
        var response = await graphQLClient.SendMutationAsync<object>(request);
        _logger.LogDebug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating containingElement, got feedback: {feedback}", response.Data);

        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in creating plant, error: {response.Errors}");
        }
        
        return id;
    }

    private async Task<string> CreateArea(CreateContainingElementDTO value)
    {
        _logger.LogDebug("creating plant with information: {information}", JsonConvert.SerializeObject(value));
        var id = Guid.NewGuid().ToString();
        var request = new GraphQLRequest
        {
            Query = @"
                            mutation Mutation($input: [AreaCreateInput!]!, $where: PlantWhere, $update: PlantUpdateInput) {
                                createAreas(input: $input) {
                                    areas {
                                        id
                                    }
                                }
                                updatePlants(where: $where, update: $update) {
                                    plants {
                                      name
                                    }
                                }
                            }",
            Variables = new
            {
                input = new[]
                {
                    new
                    {
                        id = id,
                        name = value.name,
                        description = value.description,
                        lines = new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id_IN = value.children
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                where = new
                {
                    id = value.parent
                },
                update = new 
                {
                    areas = new[]
                    {
                        new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id = id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        
        var response = await graphQLClient.SendMutationAsync<object>(request);
        _logger.LogDebug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating containingElement, got feedback: {feedback}", response.Data);

        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in creating area, error: {response.Errors}");
        }
        
        return id;
    }

    private async Task<string> CreateLine(CreateContainingElementDTO value)
    {
        _logger.LogDebug("creating plant with information: {information}", JsonConvert.SerializeObject(value));
        var id = Guid.NewGuid().ToString();
        var request = new GraphQLRequest
        {
            Query = @"
                            mutation Mutation($input: [LineCreateInput!]!, $where: AreaWhere, $update: AreaUpdateInput) {
                                createLines(input: $input) {
                                    lines {
                                        id
                                    }
                                }
                                updateAreas(where: $where, update: $update) {
                                    areas {
                                      name
                                    }
                                }
                            }",
            Variables = new
            {
                input = new[]
                {
                    new
                    {
                        id = id,
                        name = value.name,
                        description = value.description,
                        cells = new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id_IN = value.children
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                where = new
                {
                    id = value.parent
                },
                update = new 
                {
                    lines = new[]
                    {
                        new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id = id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        
        var response = await graphQLClient.SendMutationAsync<object>(request);
        _logger.LogDebug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating containingElement, got feedback: {feedback}", response.Data);

        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in creating line, error: {response.Errors}");
        }
        
        return id;
    }
    
    private async Task<string> CreateCell(CreateContainingElementDTO value)
    {
        _logger.LogDebug("creating plant with information: {information}", JsonConvert.SerializeObject(value));
        var id = Guid.NewGuid().ToString();
        var request = new GraphQLRequest
        {
            Query = @"
                            mutation Mutation($input: [CellCreateInput!]!, $where: LineWhere, $update: LineUpdateInput) {
                                createCells(input: $input) {
                                    cells {
                                        id
                                    }
                                }
                                updateLines(where: $where, update: $update) {
                                    lines {
                                      name
                                    }
                                }
                            }",
            Variables = new
            {
                input = new[]
                {
                    new
                    {
                        id = id,
                        name = value.name,
                        description = value.description,
                        machines = new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id_IN = value.children
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                where = new
                {
                    id = value.parent
                },
                update = new 
                {
                    cells = new[]
                    {
                        new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id = id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        
        var response = await graphQLClient.SendMutationAsync<object>(request);
        _logger.LogDebug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating containingElement, got feedback: {feedback}", response.Data);

        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in creating cell, error: {response.Errors}");
        }
        
        return id;
    }

    private async Task<string> CreateMachine(CreateContainingElementDTO value)
    {
        _logger.LogDebug("creating plant with information: {information}", JsonConvert.SerializeObject(value));
        var id = value.id ?? Guid.NewGuid().ToString();
        var request = new GraphQLRequest
        {
            Query = @"
                            mutation Mutation($input: [MachineCreateInput!]!, $where: CellWhere, $update: CellUpdateInput) {
                                createMachines(input: $input) {
                                    machines {
                                        id
                                    }
                                }
                                updateCells(where: $where, update: $update) {
                                    cells {
                                      name
                                    }
                                }
                            }",
            Variables = new
            {
                input = new[]
                {
                    new
                    {
                        id = id,
                        name = value.name,
                        description = value.description,
                        observableProperties = new
                        {
                            connect = new []
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id_IN = value.observableProperties
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                where = new
                {
                    id = value.parent
                },
                update = new 
                {
                    machines = new[]
                    {
                        new
                        {
                            connect = new[]
                            {
                                new
                                {
                                    where = new
                                    {
                                        node = new
                                        {
                                            id = id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        
        var response = await graphQLClient.SendMutationAsync<object>(request);
        _logger.LogDebug(JsonConvert.SerializeObject(response));
        _logger.LogCritical("when creating containingElement, got feedback: {feedback}", response.Data);

        if (response.Errors != null)
        {
            throw new ArgumentException($"Failed in creating cell, error: {response.Errors}");
        }
        
        return id;
    }

    private async Task<string> CreateStaff(CreateContainingElementDTO value)
    {
        throw new NotImplementedException();
    }
}