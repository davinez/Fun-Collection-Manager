




select * from manager.collection_group cg where cg."name" = 'Prueba 1 Grupo'

select * from manager.collection c where c."name" = 'PPPP'
       
       
select * from manager.bookmark b 




-------DELETE Boomarks

begin;


select * from manager.bookmark b;


DELETE FROM manager.bookmark
WHERE collection_id=1;

select * from manager.bookmark b;

-- commit;


rollback;


/********* Final Query Bookmarks   *********/


/* 
----SQL Variables----

-user_account_id

*/


export type TGetAllBookmarks = {
  bookmarks: TBookmark[];
  total: number;
}


export type TBookmark = {
  id: number;
  cover: string;
  title: string;
  description: string;
  websiteURL: string;
  bookmarkDetail: TBookmarkDetail;
}

type TBookmarkDetail = {
  collectionDetail?: { icon: string, name: string };
  createdAt: string;
}


debounceSearchValue.length !== 0 ?
{
            page: page,
            page_limit: pageLimit,
            filter_type: filterType,
            search_value: debounceSearchValue
} :
{
            page: page,
            page_limit: pageLimit
}
          
          

select 
-- Bookmark Info
b.id as "BookmarkId",
b.cover as "BookmarkCover",
b.title as "Title",
b.description as "Description",
b.website_url as "WebsiteUrl",
-- Collection Info
c.id as "CollectionId",
c.icon as "CollectionIcon",
c."name" as "CollectionName",
c.created as "CollectionCreatedAt"
from manager.collection_group cg 
inner join manager.collection c on cg.id = c.collection_group_id 
inner join manager.bookmark b on c.id = b.collection_id 
where cg.user_account_id = 4








