-- Create the USERS table
CREATE TABLE USERS (
    username VARCHAR(30) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
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

-- data for ARTISTS
INSERT INTO ARTISTS (artist_id, artist_name)
VALUES
('0du5cEVh5yTK9QJze8zA0C', 'Bruno Mars'),
('246dkjvS1zLTtiykXe5h60', 'Post Malone');

-- data for albums from Spotify
INSERT INTO ALBUMS (album_id, album_name, release_date, artist_id)
VALUES
('58ufpQsJ1DS5kq4hhzQDiI', 'Unorthodox Jukebox', '2012-12-07', '0du5cEVh5yTK9QJze8zA0C'),
('4BbsHmXEghoPPevQjPnHXx', 'F-1 Trillion', '2024-08-15', '246dkjvS1zLTtiykXe5h60');

-- data for SONGS
INSERT INTO SONGS (song_id, name, album_id, year, duration)
VALUES
('3G5iN5QBqMeXx3uZPy8tgB', 'Young Girls', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 228720),
('3w3y8KPTfNeOKPiqUTakBh', 'Locked out of Heaven', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 233478),
('2ih2U8ttFzCjnQ5njF3SrR', 'Gorilla', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 244493),
('55h7vJchibLdUkxdlX3fK7', 'Treasure', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 178560),
('30raivfq7rSt5nKltiHfzG', 'Moonshine', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 228573),
('0nJW01T7XtvILxQgC5J7Wh', 'When I Was Your Man', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 213826),
('0inMKhbKWOTDA9UBUAKoU6', 'Natalie', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 225026),
('2tCPIp83mRXvVTytTAf1W4', 'Show Me', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 207560),
('6FPQabaldvKE5cjqRfY9Os', 'Money Make Her Smile', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 203973),
('7lXOqE38eCr979gp27O5wr', 'If I Knew', '58ufpQsJ1DS5kq4hhzQDiI', 2012, 132640),
('2CIXO1jQbrV1hlfI7FUKld', 'Wrong Ones (Feat. Tim McGraw)', '4BbsHmXEghoPPevQjPnHXx', 2024, 195822),
('4Kd9tBUgpXv26OfR6ugBv1', 'Finer Things (Feat. Hank Williams Jr.)', '4BbsHmXEghoPPevQjPnHXx', 2024, 185533),
('5IZXB5IKAD2qlvTPJYDCFB', 'I Had Some Help (Feat. Morgan Wallen)', '4BbsHmXEghoPPevQjPnHXx', 2024, 178205),
('0mNzElhEofvgMWAJoOA4q9', 'Pour Me A Drink (Feat. Blake Shelton)', '4BbsHmXEghoPPevQjPnHXx', 2024, 195122),
('1sqXfPaRD7npnH712RZQAF', 'Have The Heart (Feat. Dolly Parton)', '4BbsHmXEghoPPevQjPnHXx', 2024, 183333),
('0lJNSfWnwJMIh94Dv9jQUt', 'What Don''t Belong To Me', '4BbsHmXEghoPPevQjPnHXx', 2024, 207176),
('20hTkA9oKKuxghkRptRczS', 'Goes Without Saying (Feat. Brad Paisley)', '4BbsHmXEghoPPevQjPnHXx', 2024, 212353),
('6StwwqB84sJeLr7tZDTxEX', 'Guy For That (Feat. Luke Combs)', '4BbsHmXEghoPPevQjPnHXx', 2024, 164011),
('25uMKq5kygC2woAfeetEfE', 'Nosedive (Feat. Lainey Wilson)', '4BbsHmXEghoPPevQjPnHXx', 2024, 192459),
('0gucUyFMFRMlUiVn9US4YX', 'Losers (Feat. Jelly Roll)', '4BbsHmXEghoPPevQjPnHXx', 2024, 209038),
('149r4BNMXwFRWjPYcKNNgc', 'Devil I''ve Been (Feat. ERNEST)', '4BbsHmXEghoPPevQjPnHXx', 2024, 182924),
('4rhSYWoLaBbkQccjme9UOJ', 'Never Love You Again (Feat. Sierra Ferrell)', '4BbsHmXEghoPPevQjPnHXx', 2024, 186861),
('1IzCS4zuowRsXu4YS8caOB', 'Missin’ You Like This (Feat. Luke Combs)', '4BbsHmXEghoPPevQjPnHXx', 2024, 222781),
('1SPI4AlK4121PEQPGSpdcY', 'California Sober (Feat. Chris Stapleton)', '4BbsHmXEghoPPevQjPnHXx', 2024, 204411),
('6nf4oqFOsVKLwJPEliYVwT', 'Hide My Gun (Feat. HARDY)', '4BbsHmXEghoPPevQjPnHXx', 2024, 220479),
('7k2nR2eTRVuzAMCXUj3HMv', 'Right About You', '4BbsHmXEghoPPevQjPnHXx', 2024, 183046),
('3It5ZyIlvFxgrxAkiQLGBR', 'M-E-X-I-C-O (Feat. Billy Strings)', '4BbsHmXEghoPPevQjPnHXx', 2024, 155928),
('0DM63CJEklNPKu6kHGyuEl', 'Yours', '4BbsHmXEghoPPevQjPnHXx', 2024, 199438);

-- data for SONG_ARTISTS
INSERT INTO SONG_ARTISTS (song_id, artist_id)
VALUES
('3G5iN5QBqMeXx3uZPy8tgB', '0du5cEVh5yTK9QJze8zA0C'),
('3w3y8KPTfNeOKPiqUTakBh', '0du5cEVh5yTK9QJze8zA0C'),
('2ih2U8ttFzCjnQ5njF3SrR', '0du5cEVh5yTK9QJze8zA0C'),
('55h7vJchibLdUkxdlX3fK7', '0du5cEVh5yTK9QJze8zA0C'),
('30raivfq7rSt5nKltiHfzG', '0du5cEVh5yTK9QJze8zA0C'),
('0nJW01T7XtvILxQgC5J7Wh', '0du5cEVh5yTK9QJze8zA0C'),
('0inMKhbKWOTDA9UBUAKoU6', '0du5cEVh5yTK9QJze8zA0C'),
('2tCPIp83mRXvVTytTAf1W4', '0du5cEVh5yTK9QJze8zA0C'),
('6FPQabaldvKE5cjqRfY9Os', '0du5cEVh5yTK9QJze8zA0C'),
('7lXOqE38eCr979gp27O5wr', '0du5cEVh5yTK9QJze8zA0C'),
('2CIXO1jQbrV1hlfI7FUKld', '246dkjvS1zLTtiykXe5h60'),
('4Kd9tBUgpXv26OfR6ugBv1', '246dkjvS1zLTtiykXe5h60'),
('5IZXB5IKAD2qlvTPJYDCFB', '246dkjvS1zLTtiykXe5h60'),
('0mNzElhEofvgMWAJoOA4q9', '246dkjvS1zLTtiykXe5h60'),
('1sqXfPaRD7npnH712RZQAF', '246dkjvS1zLTtiykXe5h60'),
('0lJNSfWnwJMIh94Dv9jQUt', '246dkjvS1zLTtiykXe5h60'),
('20hTkA9oKKuxghkRptRczS', '246dkjvS1zLTtiykXe5h60'),
('6StwwqB84sJeLr7tZDTxEX', '246dkjvS1zLTtiykXe5h60'),
('25uMKq5kygC2woAfeetEfE', '246dkjvS1zLTtiykXe5h60'),
('0gucUyFMFRMlUiVn9US4YX', '246dkjvS1zLTtiykXe5h60'),
('149r4BNMXwFRWjPYcKNNgc', '246dkjvS1zLTtiykXe5h60'),
('4rhSYWoLaBbkQccjme9UOJ', '246dkjvS1zLTtiykXe5h60'),
('1IzCS4zuowRsXu4YS8caOB', '246dkjvS1zLTtiykXe5h60'),
('1SPI4AlK4121PEQPGSpdcY', '246dkjvS1zLTtiykXe5h60'),
('6nf4oqFOsVKLwJPEliYVwT', '246dkjvS1zLTtiykXe5h60'),
('7k2nR2eTRVuzAMCXUj3HMv', '246dkjvS1zLTtiykXe5h60'),
('3It5ZyIlvFxgrxAkiQLGBR', '246dkjvS1zLTtiykXe5h60'),
('0DM63CJEklNPKu6kHGyuEl', '246dkjvS1zLTtiykXe5h60');


-- data for RATINGS
INSERT INTO RATINGS (song_id, username, rating)
VALUES 
('3G5iN5QBqMeXx3uZPy8tgB', 'jsmith23', 3),
('55h7vJchibLdUkxdlX3fK7', 'amiller', 5),
('55h7vJchibLdUkxdlX3fK7', 'eroberts', 5);

