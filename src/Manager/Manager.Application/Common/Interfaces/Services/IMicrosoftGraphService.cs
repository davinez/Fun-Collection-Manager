using System;
using System.Threading.Tasks;
using Microsoft.Graph.Models;

namespace Manager.Application.Common.Interfaces.Services;

public interface IMicrosoftGraphService
{
    public Task<bool> AssignRoleToUser(Guid userId);
    public Task<User> GetUserById(Guid userId);  
}
