-- Create the USERS table
CREATE TABLE USERS (
    username VARCHAR(30) PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    preferred_name VARCHAR(30),
    email VARCHAR(50) UNIQUE NOT NULL
);

-- Create the PLAYLISTS table
CREATE TABLE PLAYLISTS (
    playlist_id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    username VARCHAR(30) REFERENCES USERS(username),
    visibility BOOLEAN NOT NULL -- TRUE for public, FALSE for private
);

-- Create the ARTISTS table
CREATE TABLE ARTISTS (
    artist_id VARCHAR(30) PRIMARY KEY,
    artist_name VARCHAR(100) NOT NULL
);

-- Create the ALBUMS table
CREATE TABLE ALBUMS (
    album_id VARCHAR(30) PRIMARY KEY,
    album_name VARCHAR(100) NOT NULL,
    release_date DATE,
    artist_id VARCHAR(30) REFERENCES ARTISTS(artist_id)
);

-- Create the SONGS table
CREATE TABLE SONGS (
    song_id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    album_id VARCHAR(30) REFERENCES ALBUMS(album_id),
    year INTEGER,
    duration INTEGER
);

-- Create the SONG_ARTISTS join table to handle many-to-many relationship between SONGS and ARTISTS
CREATE TABLE SONG_ARTISTS (
    song_id VARCHAR(30) REFERENCES SONGS(song_id) ON DELETE CASCADE,
    artist_id VARCHAR(30) REFERENCES ARTISTS(artist_id) ON DELETE CASCADE,
    PRIMARY KEY (song_id, artist_id)
);

-- Create the RATINGS table
CREATE TABLE RATINGS (
    song_id VARCHAR(30) REFERENCES SONGS(song_id) ON DELETE CASCADE,
    username VARCHAR(50) REFERENCES USERS(username) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    PRIMARY KEY (song_id, username)
);

-- Create the STREAMS table
CREATE TABLE STREAMS (
    username VARCHAR(50) REFERENCES USERS(username) ON DELETE CASCADE,
    song_id VARCHAR(30) REFERENCES SONGS(song_id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    favorite BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (username, song_id, date)
);

CREATE TABLE CONTAINS (
    playlist_id VARCHAR(30) REFERENCES PLAYLISTS(playlist_id) ON DELETE CASCADE,
    song_id VARCHAR(30) REFERENCES SONGS(song_id) ON DELETE CASCADE,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id, date_added)
); 

-- data for user
INSERT INTO USERS (username, password, preferred_name, email)
VALUES
    ('jsmith23', 'Qw3rtY!89', 'John', 'jsmith23@gmail.com'),
    ('amiller', 'P@ssw0rd2024', 'Alice', 'amiller@yahoo.com'),
    ('btran', 'Bk$ecure2024', 'Benji', 'btran@hotmail.com'),
    ('cjohnson', 'L0veCode!!', 'Clara', 'cjohnson@gmail.com'),
    ('dnguyen', 'N!ghtSky44', 'David', 'dnguyen@outlook.com'),
    ('eroberts', 'H@ppyDayz7', 'Emma', 'eroberts@yahoo.com'),
    ('fthompson', 'Thomp$on123', 'Fiona', 'fthompson@gmail.com'),
    ('glopez', 'OceanBreez3', 'Gabriel', 'glopez@hotmail.com'),
    ('hlim', 'LimPass@2024', 'Hannah', 'hlim@gmail.com'),
    ('ikarim', 'K!ngdom@99', 'Isaac', 'ikarim@outlook.com');

-- data for ARTISTS from Spotify
INSERT INTO ARTISTS (artist_id, artist_name)
VALUES
    ('1Xyo4u8uXC1ZmMpatF05PJ', 'The Weeknd'),
    ('0Y5tJX1MQlPlqiwlOH1tJY', 'Travis Scott');

-- data for albums from Spotify
INSERT INTO ALBUMS (album_id, album_name, release_date, artist_id)
VALUES
    ('0P3oVJBFOv3TDXlYRhGL7s', 'Beauty Behind The Madness', '2015-08-28', '1Xyo4u8uXC1ZmMpatF05PJ'),
    ('41GuZcammIkupMPKH2OJ6I', 'ASTROWORLD', '2018-08-03', '0Y5tJX1MQlPlqiwlOH1tJY');

-- data for song
INSERT INTO SONGS (song_id, name, album_id, year, duration)
VALUES
    ('2xLMifQCjDGFmkHkpNLD9h', 'SICKO MODE', '41GuZcammIkupMPKH2OJ6I', 2018, 312820),
    ('7KZ5MMVgBVox9ycroB2UrI', 'CAROUSEL', '41GuZcammIkupMPKH2OJ6I', 2018, 180182),
    ('6NMtzpDQBTOfJwMzgMX0zl', 'SKELETONS', '41GuZcammIkupMPKH2OJ6I', 2018, 145588),
    ('7wBJfHzpfI3032CSD7CE2m', 'STARGAZING', '41GuZcammIkupMPKH2OJ6I', 2018, 270714),
    ('4PhsKqMdgMEUSstTDAmMpg', 'Often', '0P3oVJBFOv3TDXlYRhGL7s', 2015, 249040),
    ('1mhVXWduD8ReDwusfaHNwU', 'Tell Your Friends', '0P3oVJBFOv3TDXlYRhGL7s', 2015, 334333),
    ('03j354P848KtNU2FVSwkDG', 'Real Life', '0P3oVJBFOv3TDXlYRhGL7s', 2015, 223373);

-- data for song_artists
INSERT INTO SONG_ARTISTS (song_id, artist_id)
VALUES
('2xLMifQCjDGFmkHkpNLD9h', '0Y5tJX1MQlPlqiwlOH1tJY');

-- data for rating
INSERT INTO RATINGS (song_id, username, rating)
VALUES 
('2xLMifQCjDGFmkHkpNLD9h', 'jsmith23', 3); 
