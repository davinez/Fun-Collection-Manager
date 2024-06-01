using System;
using System.Threading.Tasks;

namespace Manager.Application.Common.Interfaces.Services;
public interface IMicrosoftGraphService
{
    public Task<bool> AssignRoleToUser(Guid userId);
}
