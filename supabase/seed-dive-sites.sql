insert into public.dive_sites
(code,name,country,country_code,region,latitude,longitude,water_type,entry_type,difficulty,max_depth,description)
values
('NL-ZLD-001','Zeelandbrug','Nederland','NL','Zeeland',51.6407,3.9013,'Zout','Kant','Gemiddeld',35,'Oosterschelde'),
('NL-ZLD-002','Den Osse Haven','Nederland','NL','Zeeland',51.7467,3.8516,'Zout','Kant','Beginner',30,'Zeeland'),
('NL-ZLD-003','Dreischor Gemaal','Nederland','NL','Zeeland',51.6945,3.9785,'Zout','Kant','Gemiddeld',30,'Zeeland'),
('NL-VKP-001','Vinkeveense Plassen - Zandeiland 4','Nederland','NL','Utrecht',52.2496,4.9567,'Zoet','Kant','Beginner',22,'Vinkeveen'),
('NL-VKP-002','Vinkeveense Plassen - Zandeiland 9','Nederland','NL','Utrecht',52.2452,4.9648,'Zoet','Kant','Beginner',18,'Vinkeveen'),
('CW-001','Tugboat','Curaçao','CW','Caracasbaai',12.0729,-68.8614,'Zout','Kant','Beginner',18,'Curaçao'),
('CW-002','Playa Kalki','Curaçao','CW','Westpunt',12.3702,-69.1578,'Zout','Kant','Beginner',35,'Curaçao')
on conflict (code) do update set
name=excluded.name,country=excluded.country,country_code=excluded.country_code,region=excluded.region,
latitude=excluded.latitude,longitude=excluded.longitude,water_type=excluded.water_type,entry_type=excluded.entry_type,
difficulty=excluded.difficulty,max_depth=excluded.max_depth,description=excluded.description;
