using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Dapper;
using Manager.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Manager.Infrastructure.Data;

public class ManagerReadDbConnection : IManagerReadDbConnection, IDisposable
{
    private readonly IDbConnection _connection;

    public ManagerReadDbConnection(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("managerdb");

        Guard.Against.Null(connectionString, message: "Connection string 'managerdb' not found.");

        _connection = new NpgsqlConnection(connectionString);
    }

    public async Task<IReadOnlyList<T>> QueryAsync<T>(string sql, object? param = null, IDbTransaction? transaction = null, CancellationToken cancellationToken = default)
    {
        return (await _connection.QueryAsync<T>(sql, param, transaction)).AsList();
    }

    public async Task<IEnumerable<TResult>> QueryMapAsync<T1, T2, TResult>(string sql, Func<T1, T2, TResult> map, object? param = null, IDbTransaction? transaction = null, string splitOn = "Id", CancellationToken cancellationToken = default)
    {
        return await _connection.QueryAsync(sql, map, param, transaction, true, splitOn);
    }

    public async Task<IEnumerable<TResult>> QueryMapAsync<T1, T2, T3, TResult>(string sql, Func<T1, T2, T3, TResult> map, object? param = null, IDbTransaction? transaction = null, string splitOn = "Id", CancellationToken cancellationToken = default)
    {
        return await _connection.QueryAsync(sql, map, param, transaction, true, splitOn);
    }

    public async Task<T?> QueryFirstOrDefaultAsync<T>(string sql, object? param = null, IDbTransaction? transaction = null, CancellationToken cancellationToken = default)
    {
        return await _connection.QueryFirstOrDefaultAsync<T>(sql, param, transaction);
    }

    public async Task<T> QuerySingleAsync<T>(string sql, object? param = null, IDbTransaction? transaction = null, CancellationToken cancellationToken = default)
    {
        return await _connection.QuerySingleAsync<T>(sql, param, transaction);
    }

    public void Dispose()
    {
        _connection.Dispose();
    }
}
