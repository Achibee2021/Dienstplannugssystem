INSERT INTO app_user (username, password_hash, role, enabled)
VALUES (
           'planner',
           '{bcrypt}$2a$10$9EDth/mG6G1c1l9183WEcO.zybE2VVXBcShr.Ciga9.eTV0WM47ny',
           'PLANNER',
           true
       );
INSERT INTO app_user (username, password_hash, role, enabled)
VALUES (
           'viewer',
           '{bcrypt}$2a$10$qRW69tty7Fu783knSGSUHufB9KIwknWyAs0.9JaVMnpJbDImxKAcG',
           'VIEWER',
           true
       );