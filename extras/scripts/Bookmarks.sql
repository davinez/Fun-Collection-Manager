

------------------------------- START GENERAL QUERIES ---------------------



select * from manager.bookmark b 
where b.title = 'Bookmark B CA N2 G2'





select * from manager.collection_group cg where cg."name" = 'Prueba 1 Grupo'

select * from manager.collection c where c."name" = 'PPPP'
       
       
select * from manager.bookmark b 




------------------------------- END GENERAL QUERIES ---------------------


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

                
-- All bookmarks
select 
-- Bookmark Info
b.id as "BookmarkId",
b.cover as "BookmarkCover",
b.title as "Title",
b.description as "Description",
b.website_url as "WebsiteUrl",
b.created as "BookmarkCreatedAt",
-- Collection Info
c.id as "CollectionId",
c.icon as "CollectionIcon",
c."name" as "CollectionName"
from manager.collection_group cg 
inner join manager.collection c on cg.id = c.collection_group_id 
inner join manager.bookmark b on c.id = b.collection_id 
where cg.user_account_id = 4


-- By collection
select 
-- Bookmark Info
b.id as "BookmarkId",
b.cover as "BookmarkCover",
b.title as "Title",
b.description as "Description",
b.website_url as "WebsiteUrl",
b.created as "BookmarkCreatedAt"
from manager.collection_group cg 
inner join manager.collection c on cg.id = c.collection_group_id 
inner join manager.bookmark b on c.id = b.collection_id 
where cg.user_account_id = 4
and b.title like '%Hyuse%'
and c.id = 48


select 
-- Bookmark Info
count(b.id) as "TotalRecords",
-- Collection Info
c."name" as "CollectionName"
from manager.collection_group cg 
inner join manager.collection c on cg.id = c.collection_group_id 
inner join manager.bookmark b on c.id = b.collection_id 
where cg.user_account_id = 4
and c.id = 48
group by c."name" 










