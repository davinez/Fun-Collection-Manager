using System;
using System.Threading.Tasks;
using Microsoft.Graph.Models;

namespace Manager.Application.Common.Interfaces.Services;

public interface IMicrosoftGraphService
{
    public Task<bool> AssignRoleToUser(string userHomeAccountId);
    public Task<User> GetUserById(string userHomeAccountId);  
}
