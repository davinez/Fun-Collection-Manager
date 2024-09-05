

--------- User Account

select * from manager.plan p 


select * from manager.user_account ua 

--------
BEGIN transaction;


select * from manager.user_account ua; 
select * from manager.collection_group cg;

---- Cascade delete
delete from manager.user_account ua where ua.id = 9;

commit TRANSACTION;


select * from manager.user_account ua; 

select * from manager.collection_group cg;


rollback TRANSACTION;
-----------



UPDATE manager.user_account
SET 
identity_provider_id='2e276a8f-df18-40aa-bc6c-0ff551e14d7f.8a9e53eb-e627-41e9-87cd-51ed7da4bcae'
WHERE id =4;



---------- User in Collection group


select *
from collection_group cg 
inner join user_account ua on cg.user_account_id = ua.id 



begin TRANSACTION;




UPDATE manager.collection_group 
SET user_account_id=4
WHERE id=4;



-- commit TRANSACTION;


rollback TRANSACTION;






