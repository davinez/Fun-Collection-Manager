using System;
using System.Linq;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Manager.Application.Bookmarks.Commands.CreateBookmark;
using Manager.Domain.Entities;
using Manager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace Manager.FunctionalTests.Tests.Bookmarks.Commands;

using static Testing;

public class CreateBookmark : BaseTestFixture
{
    [Test]
    public async Task ShouldCreateBookmark()
    {
        // Arrange
        var identityProviderId = await RunAsGeneralUserAsync();

        using ManagerContext dbContext = GetDbContext();

        // Seed father tables of bookmark

        var userAccount = await dbContext.UserAccounts
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(u =>
                                    u.IdentityProviderId.Equals(identityProviderId));

        userAccount.Should().NotBeNull();

        // Table 1
        var newCollectionGroup = new CollectionGroup
        {
            Name = "Test Collection Group 1",
            UserAccountId = userAccount!.Id,
        };

        dbContext.CollectionGroups.Add(newCollectionGroup);

        await dbContext.SaveChangesAsync();

        // Table 2
        var newCollection = new Collection()
        {
            Name = "Test Collection Group 1",
            CollectionGroupId = newCollectionGroup.Id,
            ParentNodeId = null,
        };

        dbContext.Collections.Add(newCollection);

        await dbContext.SaveChangesAsync();

        // Request
        var request = new CreateBookmarkCommand()
        {
            CollectionId = newCollectionGroup.Id,
            NewURL = "https://www.nestle.com.mx/",
        };

        // Act
        using var client = GetWebAppFactory().CreateClient();
        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + _entraIdAccessToken);

        var response = await client.PostAsJsonAsync("/api/bookmarks", request);

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine(await response.Content.ReadAsStringAsync());
        }
       
        // Assert
        response.Should().BeSuccessful();

        var bookmarks = await dbContext.Bookmarks
                                  .AsNoTracking()
                                  .Where(b => b.CollectionId == newCollection.Id)
                                  .ToListAsync();

        // Only one created
        bookmarks.Should().NotBeNullOrEmpty();
        bookmarks.Should().ContainSingle();

        var uniqueBookmark = bookmarks.First();

        if (uniqueBookmark.Cover != null)
        {
            uniqueBookmark.Cover.Should().NotBeNullOrWhiteSpace();
        }

        uniqueBookmark.Title.Should().NotBeNullOrWhiteSpace();
        uniqueBookmark.Description.Should().NotBeNullOrWhiteSpace();
        uniqueBookmark.WebsiteUrl.Should().NotBeNullOrWhiteSpace();

        bool isValidFormat = ValidURLFormat(uniqueBookmark.WebsiteUrl!);

        isValidFormat.Should().BeTrue();

        uniqueBookmark.Created.Should().BeCloseTo(DateTime.Now, TimeSpan.FromMinutes(20));
        uniqueBookmark.LastModified.Should().BeNull();
    }

    public static bool ValidURLFormat(string newUrl)
    {
        bool result = Uri.TryCreate(newUrl, UriKind.Absolute, out var uriResult) &&
                    (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);

        return result;
    }

}
