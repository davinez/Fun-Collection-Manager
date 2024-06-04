using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Manager.Application.Accounts.Commands.OnAttributeCollectionSubmit;

/*
 "data": {
    "@odata.type": "microsoft.graph.onAttributeCollectionSubmitResponseData",
    "actions": [
      {
        "@odata.type": "microsoft.graph.attributeCollectionSubmit.continueWithDefaultBehavior"
      }
    ]
  }
*/

public class OnAttributeCollectionSubmitDto
{
    public Data Data { get; set; } = new Data();
}

public class Data
{
    [JsonPropertyName("@odata.type")]
    public string DataType { get; set; } = string.Empty;
    public List<Action> Actions { get; set; } = [];
}

public class Action
{
    [JsonPropertyName("@odata.type")]
    public string DataType { get; set; } = string.Empty;

    // Dont serialize if null
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Message { get; set; }

}


