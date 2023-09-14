INSERT INTO app_user (id, username, password)
VALUES
    (1, 'OxygenOnline', 'SafePassword'),
    (2, 'habuma', 'Password'),
    (3, 'new_user123', 'dontremember'),
    (4, 'blobblob001', 'myPasswordIsSafer123');

INSERT INTO category (id, name)
VALUES
    (1, 'Books'),
    (2, 'Humor'),
    (3, 'Tech'),
    (4, 'For Fun'),
    (5, 'Sport');
    
INSERT INTO quiz (id, title, category_id, creator_id)
VALUES
    (1,'Are you a cat or a dog?', 4, 1),
    (2, 'Which Harry Potter house suits you?', 1, 3),
    (3, 'Would you survive a zombie apocalypse?', 5, 3);
    
INSERT INTO question (id, quiz_id, content, position)
VALUES
    (1, 1, 'Are you a morning person or a night owl?', 1),
    (2, 1, 'Favorite color?', 2),
    (3, 1, 'Favorite subject?', 3),
    (4, 2, 'Do you prefer the seaside, forest or the mountains?', 1),
    (5, 2, 'Favorite pet?', 2),
    (6, 3, 'Were you good at PE?', 1);

INSERT INTO result (id, quiz_id, title)
VALUES
    (1, 1, 'Cat'),
    (2, 1, 'Dog'),
    (3, 2, 'Ravenclaw'),
    (4, 2, 'Hufflepuff'),
    (5, 2, 'Gryffindor'),
    (6, 2, 'Slytherin'),
    (7, 3, 'Yes, you would survive'),
    (8, 3, 'No, you would die');

INSERT INTO option (id, question_id, content, position)
VALUES
    (1, 1, 'Morning person', 1),
    (2, 1, 'Night owl', 2),
    (3, 2, 'Red', 1),
    (4, 2, 'Blue', 2),
    (5, 2, 'Yellow', 3),
    (6, 3, 'Math', 1),
    (7, 3, 'Literature', 2),
    (8, 3, 'P.E.', 3),
    (9, 3, 'Arts', 4),
    (10, 4, 'Seaside', 1),
    (11, 4, 'Forest', 2),
    (12, 4, 'Mountain', 3),
    (13, 5, 'Dog', 1),
    (14, 5, 'Cat', 2),
    (15, 5, 'Something exotic', 3),
    (16, 6, 'Yes', 1),
    (17, 6, 'No', 2);
    
INSERT INTO option_result (option_id, result_id)
VALUES
    (1, 2),
    (2, 1),
    (3, 1),
    (3, 2),
    (4, 2),
    (5, 1),
    (6, 1),
    (7, 2),
    (8, 2),
    (9, 1),
    (10, 6),
    (11, 5),
    (11, 4),
    (12, 3),
    (13, 5),
    (13, 4),
    (14, 6),
    (15, 3),
    (16, 7),
    (17, 8);
