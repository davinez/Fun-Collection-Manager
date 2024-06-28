


--------- Group Collections 

INSERT INTO manager.collection_group
("name", user_account_id, created)
values
('Grupo A', 4, NOW()),
('Grupo B', 4, NOW()),
('Grupo C', 4, NOW());


select * from manager.collection_group cg 



--------- Collections 


select * from manager.collection c 

-- Group 1

INSERT INTO manager.collection
(id, name, icon, parent_node_id, collection_group_id, created)
OVERRIDING SYSTEM VALUE 
values
(1, 'Coleccion A N0 G1', '/assets/icons/bookmark.svg', null, 1, NOW()),
(2, 'Coleccion B N0 G1', '/assets/icons/bookmark.svg', null, 1, NOW()),
(3, 'Coleccion C N0 G1', '/assets/icons/bookmark.svg', null, 1, NOW()),
(4, 'Coleccion A N1 G1', '/assets/icons/bookmark.svg', 1, 1, NOW()),
(5, 'Coleccion B N1 G1', '/assets/icons/bookmark.svg', 2, 1, NOW()),
(6, 'Coleccion C N1 G1', '/assets/icons/bookmark.svg', 3, 1, NOW()),
(7, 'Coleccion A N2 G1', '/assets/icons/bookmark.svg', 4, 1, NOW()),
(8, 'Coleccion B N2 G1', '/assets/icons/bookmark.svg', 5, 1, NOW()),
(9, 'Coleccion C N2 G1', '/assets/icons/bookmark.svg', 6, 1, NOW());

-- Group 2

INSERT INTO manager.collection
(id, name, icon, parent_node_id, collection_group_id, created)
OVERRIDING SYSTEM VALUE 
values
(10, 'Coleccion A N0 G2', '/assets/icons/bookmark.svg', null, 2, NOW()),
(11, 'Coleccion B N0 G2', '/assets/icons/bookmark.svg', null, 2, NOW()),
(12, 'Coleccion C N0 G2', '/assets/icons/bookmark.svg', null, 2, NOW()),
(13, 'Coleccion A N1 G2', '/assets/icons/bookmark.svg', 10, 2, NOW()),
(14, 'Coleccion B N1 G2', '/assets/icons/bookmark.svg', 11, 2, NOW()),
(15, 'Coleccion C N1 G2', '/assets/icons/bookmark.svg', 12, 2, NOW()),
(16, 'Coleccion A N2 G2', '/assets/icons/bookmark.svg', 13, 2, NOW()),
(17, 'Coleccion B N2 G2', '/assets/icons/bookmark.svg', 14, 2, NOW()),
(18, 'Coleccion C N2 G2', '/assets/icons/bookmark.svg', 15, 2, NOW());


-- Bookmark 1

INSERT INTO manager.bookmark
(cover, title, description, website_url, collection_id, created)
VALUES
('', 'Bookmark A CA N0 G1', 'Descripcion', 'URL', 1, NOW()),
('', 'Bookmark A CA N1 G1', 'Descripcion', 'URL', 4, NOW()),
('', 'Bookmark A CA N2 G2', 'Descripcion', 'URL', 16, NOW()),
('', 'Bookmark B CA N2 G2', 'Descripcion', 'URL', 16, NOW());



begin;


select * 
from manager.collection c 
where c.parent_node_id = 3;


INSERT INTO manager.collection
(name, icon, parent_node_id, collection_group_id, created)
VALUES('Coleccion C2 N1', '/assets/icons/bookmark.svg', 3, 1, NOW());


select * 
from manager.collection c 
where c.parent_node_id = 3;

-- commit;


rollback;


SELECT pg_catalog.setval(pg_get_serial_sequence('manager.collection', 'id'), (SELECT MAX(id) FROM manager.collection c)+1);

SELECT pg_catalog.setval(pg_get_serial_sequence('manager.collection_group', 'id'), (SELECT MAX(id) FROM manager.collection_group cg)+1);




--- Final Queries Collection Tree


----Variables----

--user_account_id


	WITH RECURSIVE tree (
        collection_id, 
        collection_name, 
        collection_icon, 
        parent_node_id, 
        group_id, 
        group_name
        ) AS
        (
          SELECT 
          c.id as collection_id, 
          c.name as collection_name, 
          c.icon as collection_icon, 
          c.parent_node_id, 
          cg.id as group_id,
          cg.name as group_name
            FROM manager.collection_group cg   
            LEFT JOIN manager.collection c ON c.collection_group_id = cg.id
            WHERE c.parent_node_id IS NULL -- the tree node
            AND cg.user_account_id = 4
          UNION ALL
          SELECT 
          c2.id as collection_id, 
          c2.name as collection_name, 
          c2.icon as collection_icon, 
          c2.parent_node_id, 
          cg.id as group_id, 
          cg.name as group_name
            FROM manager.collection_group cg
            INNER JOIN tree t ON cg.id = t.group_id
            JOIN manager.collection c2 ON t.collection_id = c2.parent_node_id
        ), bookmarks_info (
        collection_id,
        bookmarks_counter
        ) 
        AS (

        SELECT 
        t.collection_id,
        COUNT(b.id) as bookmarks_counter
        FROM manager.bookmark b
        LEFT JOIN tree t ON t.collection_id = b.collection_id
        GROUP BY t.collection_id

        )
        SELECT 
        t.collection_id as "CollectionId",
        t.collection_name as "CollectionName",
        t.collection_icon as "CollectionIcon",
        t.parent_node_id as "ParentNodeId",
        t.group_id as "GroupId",
        t.group_name as "GroupName",
        CASE
          WHEN b.bookmarks_counter > 0 THEN bookmarks_counter
          ELSE 0
        END 
          AS "BookmarksCounter"
        FROM tree t
        LEFT JOIN bookmarks_info b ON b.collection_id = t.collection_id;
		--ORDER BY t.collection_id; 



-- Further optimization??


select * from manager.collection_group cg where cg."name" = 'Prueba 1 Grupo'

select * from manager.collection c where c."name" = 'PPPP'
       
       

