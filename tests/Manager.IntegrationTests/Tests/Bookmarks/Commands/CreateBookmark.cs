using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using NUnit.Framework;

namespace Manager.FunctionalTests.Tests.Bookmarks.Commands;

using static Testing;

public class CreateBookmark : BaseTestFixture
{
    [Test]
    public async Task ShouldCreateBookmark()
    {
        // Arrange
        var userId = await RunAsGeneralUserAsync();
        HttpClient client = GetWebAppFactory().CreateClient();

        // Act
        var response = await client.GetAsync("/api/Resident/GetAllResidents");

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var allresidentsResponse = JsonSerializer.Deserialize<GetAllResidentsResponse>(content);


        allresidentsResponse.Should().NotBeNull();
        allresidentsResponse.residents.Should().NotBeNull();
        allresidentsResponse.residents.Should().BeEmpty();


        var listId = await SendAsync(new CreateTodoListCommand
        {
            Title = "New List"
        });

        var command = new CreateTodoItemCommand
        {
            ListId = listId,
            Title = "Tasks"
        };

        var itemId = await SendAsync(command);

        var item = await FindAsync<TodoItem>(itemId);

        // Assert
        item.Should().NotBeNull();
        item!.ListId.Should().Be(command.ListId);
        item.Title.Should().Be(command.Title);
        item.CreatedBy.Should().Be(userId);
        item.Created.Should().BeCloseTo(DateTime.Now, TimeSpan.FromMilliseconds(10000));
        item.LastModifiedBy.Should().Be(userId);
        item.LastModified.Should().BeCloseTo(DateTime.Now, TimeSpan.FromMilliseconds(10000));
    }

}
