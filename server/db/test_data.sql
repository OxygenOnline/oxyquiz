INSERT INTO app_user (id, username, password)
VALUES
    (1001, 'OxygenOnline', 'SafePassword'),
    (1002, 'habuma', 'Password'),
    (1003, 'new_user123', 'dontremember'),
    (1004, 'blobblob001', 'myPasswordIsSafer123');

INSERT INTO category (id, name)
VALUES
    (1, 'Books'),
    (2, 'Humor'),
    (3, 'Tech'),
    (4, 'For Fun'),
    (5, 'Sport');
    
INSERT INTO quiz (id, title, category_id, creator_id)
VALUES
    (1001,'Are you a cat or a dog?', 4, 1001),
    (1002, 'Which Harry Potter house suits you?', 1, 1003),
    (1003, 'Would you survive a zombie apocalypse?', 5, 1003);
    
INSERT INTO question (id, quiz_id, content, position)
VALUES
    (1001, 1001, 'Are you a morning person or a night owl?', 1),
    (1002, 1001, 'Favorite color?', 2),
    (1003, 1001, 'Favorite subject?', 3),
    (1004, 1002, 'Do you prefer the seaside, forest or the mountains?', 1),
    (1005, 1002, 'Favorite pet?', 2),
    (1006, 1003, 'Were you good at PE?', 1);

INSERT INTO result (id, quiz_id, title)
VALUES
    (1001, 1001, 'Cat'),
    (1002, 1001, 'Dog'),
    (1003, 1002, 'Ravenclaw'),
    (1004, 1002, 'Hufflepuff'),
    (1005, 1002, 'Gryffindor'),
    (1006, 1002, 'Slytherin'),
    (1007, 1003, 'Yes, you would survive'),
    (1008, 1003, 'No, you would die');

INSERT INTO option (id, question_id, content, position)
VALUES
    (1001, 1001, 'Morning person', 1),
    (1002, 1001, 'Night owl', 2),
    (1003, 1002, 'Red', 1),
    (1004, 1002, 'Blue', 2),
    (1005, 1002, 'Yellow', 3),
    (1006, 1003, 'Math', 1),
    (1007, 1003, 'Literature', 2),
    (1008, 1003, 'P.E.', 3),
    (1009, 1003, 'Arts', 4),
    (1010, 1004, 'Seaside', 1),
    (1011, 1004, 'Forest', 2),
    (1012, 1004, 'Mountain', 3),
    (1013, 1005, 'Dog', 1),
    (1014, 1005, 'Cat', 2),
    (1015, 1005, 'Something exotic', 3),
    (1016, 1006, 'Yes', 1),
    (1017, 1006, 'No', 2);
    
INSERT INTO option_result (option_id, result_id)
VALUES
    (1001, 1002),
    (1002, 1001),
    (1003, 1001),
    (1003, 1002),
    (1004, 1002),
    (1005, 1001),
    (1006, 1001),
    (1007, 1002),
    (1008, 1002),
    (1009, 1001),
    (1010, 1006),
    (1011, 1005),
    (1011, 1004),
    (1012, 1003),
    (1013, 1005),
    (1013, 1004),
    (1014, 1006),
    (1015, 1003),
    (1016, 1007),
    (1017, 1008);
