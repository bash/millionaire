CREATE OR REPLACE FUNCTION mill.insert_question(
    question VARCHAR(255),
    correct_answer VARCHAR(255),
    incorrect_answer_1 VARCHAR(255),
    incorrect_answer_2 VARCHAR(255),
    incorrect_answer_3 VARCHAR(255),
    _category VARCHAR(255)
  )
  RETURNS VOID AS $$
  DECLARE
    category_id BIGINT;
    question_id BIGINT;
  BEGIN
    SELECT id FROM mill.category WHERE mill.category.name = _category INTO category_id;

    IF category_id IS NULL THEN
      category_id := mill.next_id();
      INSERT INTO mill.category (id, name) VALUES (category_id, _category);
    END IF;

    question_id := mill.next_id();

    INSERT INTO mill.question (id, title, category_id)
      VALUES (question_id, question, category_id);

    INSERT INTO mill.answer (title, is_correct, question_id) VALUES (correct_answer, TRUE, question_id);
    INSERT INTO mill.answer (title, is_correct, question_id) VALUES (incorrect_answer_1, FALSE, question_id);
    INSERT INTO mill.answer (title, is_correct, question_id) VALUES (incorrect_answer_2, FALSE, question_id);
    INSERT INTO mill.answer (title, is_correct, question_id) VALUES (incorrect_answer_3, FALSE, question_id);
  END;
  $$ LANGUAGE PLPGSQL;




SELECT mill.insert_question(E'Wie lange war der Lift an der BBB defekt?', E'10 Wochen', E'6 Wochen', E'8 Wochen', E'12 Wochen', E'BBB');
SELECT mill.insert_question(E'Herr Fiechter ist ein ...', E'Hirsch', E'Bär', E'Elch', E'Luchs', E'BBB');
SELECT mill.insert_question(E'Wie heißt ein international bekannte deutsche Kurstadt?', E'Baden-Baden', E'Duschen-Duschen', E'Waschen-Waschen', E'Putzen Putzen', E'Geographie');
SELECT mill.insert_question(E'Was für ein Tier ist Bambi im gleichnaigen Disney-Film?', E'Reh', E'Eichhörnchen', E'Wasserfloh', E'Meerschweinchen', E'Filme');
SELECT mill.insert_question(E'Berlin-Beuscher schlendert durch das Brandenburger Tor auf die Alee "Unter den …"?', E'Linden', E'Litschis', E'Linsen', E'Liedern', E'Kultur');
SELECT mill.insert_question(E'Wie heißt der Stadtteil von Los Angeles, der zum Mekka der Filmindustrie wurde?', E'Hollywood', E'Beverly Hills', E'Santa Monica', E'Flushing Meadows', E'Filme');
SELECT mill.insert_question(E'Was machen Schwimmer, wenn sie schnell sein wollen?', E'kraulen', E'streicheln', E'tätscheln', E'schmusen', E'Sport');
SELECT mill.insert_question(E'Welches Zeichen erhalten umweltfreundliche Produkte in Deutschland seit 1978?', E'Blauer Engel', E'Zebrastreifen', E'Schwarze Mamba', E'Rote Zora', E'Lebensmittel');
SELECT mill.insert_question(E'Welcher dieser Namen steht nicht für Hardrock und Heavy Metal?', E'Modern Talking', E'Metallica', E'Iron Maiden', E'Motörhead', E'Musik');
SELECT mill.insert_question(E'Mit wem geht man normalerweise nicht Gassi?', E'Trendsetter', E'Rauhaardackel', E'Foxterrier', E'Cockerspaniel', E'Tiere');
SELECT mill.insert_question(E'Wie lauter der grammitkalisch korrekte Komparativ zu "gut"?', E'besser', E'sehr gut', E'schlecht', E'bestens', E'Grammatik');
SELECT mill.insert_question(E'Welchem Vogel hat man redensartlich, wenn man nicht ganz dicht ist?', E'Meise', E'Specht', E'Lerche', E'Krähe', E'Tiere');
SELECT mill.insert_question(E'Was spielt im Straßenverkehr eine wichtige Rolle?', E'Zebrastreifen', E'Schafspelz', E'Fuchschwanz', E'Tigerfell', E'Verkehr');
SELECT mill.insert_question(E'Welche ausgehöhlten Früchte sind der Klassiker bei der Halloween-Dekoration?', E'Kürbisse', E'Wassermelonen', E'Kokosnüsse', E'Steckrüben', E'Feiertage');
SELECT mill.insert_question(E'Welcher dieser Fische ist kein Plattfisch?', E'Kugelfisch', E'Flunder', E'Scholle', E'Steinbutt', E'Tiere');
SELECT mill.insert_question(E'Wie nennt man die "Erlaubnis zum Betrieb eines nicht völlig erlaubnisfreien Gewerbes"?', E'Konzession', E'Konfession', E'Konfektion', E'Konfusion', E'Wirtschaft');
SELECT mill.insert_question(E'Welcher aus einem Strauch gewonnene Farbstoff wird zum Rotfärben von Haut und Haaren verwendet?', E'Henna', E'Purpur', E'Karmesin', E'Scharlach', E'Pflanzen');
SELECT mill.insert_question(E'Welches Adelsgeschlecht herrscht von 1523 bis 1654 in Schweden?', E'Wasa', E'Knäcke', E'Smörrebrod', E'Leinsam', E'Geschichte');
SELECT mill.insert_question(E'Herbert Grönemeyers "Männer" bestehen durch ihr Geld und ihre …?', E'Lässigkeit', E'Männlichkeit', E'Ehrlichkeit', E'Heiterkeit', E'Kultur');
SELECT mill.insert_question(E'Was ist im Alpenraum als Eierschwamm bekannt?', E'Pfifferling', E'Bienenstich', E'Mangold', E'Omelett', E'Pflanzen');
SELECT mill.insert_question(E'Wer die Missetaten von anderen verrät, der …?', E'petzt', E'putzt', E'platzt', E'patzt', E'Sprichwörter');
SELECT mill.insert_question(E'Wer viel Aufhebens um eine nichtige Sache macht, entfesselt einen Sturm im …?', E'Wasserglas', E'Milchkännchen', E'Bierkrug', E'Kaffebecher', E'Sprichwörter');
SELECT mill.insert_question(E'Welcher Begriff bezeichnet ein Gremium aus mehreren Richtern?', E'Kammer', E'Stube', E'Raum', E'Zimmer', E'Recht');
SELECT mill.insert_question(E'Was gibt es bei jedem gut sortierten Gemüsehändler zu kaufen?', E'Austernpilze', E'Krebsgurken', E'Kaviarbohnen', E'Muschelerbsen', E'Lebensmittel');
SELECT mill.insert_question(E'Womit erzeugen Schlagzeuger Rhythmen?', E'Besen', E'Bürste', E'Staubsauger', E'Schwamm', E'Musik');
SELECT mill.insert_question(E'Was ist ein Katarrh?', E'Schleimhautentzündung', E'orthodoxer Priester', E'Kaffee mit Vanillelikör', E'Langärmliges Gewand', E'Kultur');
SELECT mill.insert_question(E'In der hierzulande üblichen Zählweise folgt bei Babykleidung auf die Größe 68 die Größe …?', E'74', E'69', E'70', E'78', E'Kleider');
SELECT mill.insert_question(E'Auf wen geht das Motto "Frisch, fromm, fröhlich, frei" zurück?', E'Turnvater Jahn', E'Martin Luther', E'Jupp Derwall', E'Leni Riefenstahl', E'Sprichwörter');
SELECT mill.insert_question(E'Wo waltet hierzulande ein Superintendend seines Amtes?', E'evangelische Kirche', E'Rundfunkanstalt', E'Schauspielhaus', E'Bundeswehr', E'Kultur');
SELECT mill.insert_question(E'Welchen Formel-1-Rekord hält Michael Schumacher nicht?', E'meiste Pol-Position', E'meiste Siege', E'meiste WM-Punkte', E'meiste Podiumsplätze', E'Sport');
SELECT mill.insert_question(E'Was vergeblich gewesen ist, das war dem Volksmund nach für ...?', E'die Katz', E'den Ringelnatz', E'den Wurmfortsatz', E'den Zahnersatz', E'Sprichwörter');
SELECT mill.insert_question(E'Was befindet sich in Berlin-Mitte?', E'Museumsinsel', E'Galeriestand', E'Ausstellungspalme', E'Vernissagemeer', E'Geographie');
SELECT mill.insert_question(E'Wer landete mit "Daylight in Your Eyes" einen Nr. 1 Hit?', E'No Angels', E'Los Angeles', E'Charlie\'s Angels', E'Angel Heart', E'Musik');
SELECT mill.insert_question(E'Welches Kürzel ist auf fast jeder Computer-Tastatur zu finden?', E'Alt', E'Neu', E'Gebraucht', E'Uralt', E'Technik');
SELECT mill.insert_question(E'Welche deutsche Schlagercombo ist seit über 30 Jahren erfolgreich?', E'Die Flippers', E'Die Black Beautys', E'Die Furys', E'Die Skippys', E'Musik');
SELECT mill.insert_question(E'Welcher dieser vie ist kein Vampir?', E'Fantomas', E'Nosferatu', E'Dracula', E'Graf Zahl', E'Filme');
SELECT mill.insert_question(E'Womit vergleicht der Volksmund scherzhaft einen Menschen, der sich beleidigt fühlt?', E'Leberwurst', E'Rührei', E'Pflaumenmus', E'Kräuterquark', E'Sprichwörter');
SELECT mill.insert_question(E'Für welche gemeinsame Straftat eignet sich - dem Volksmund nach - ein richtig guter Kumpel', E'Pferde stehlen', E'Handtaschen rauben', E'Autos knacken', E'Feuer legen', E'Sprichwörter');
SELECT mill.insert_question(E'Wo schmerzt einen der so genannte Hexenschuss?', E'Kreuz', E'Ellenbogen', E'Wade', E'Kiefer', E'Körper');
SELECT mill.insert_question(E'Wofür steht der Begriff Oheim?', E'Onkel', E'Oggersheim', E'Ohnmacht', E'Obdachlosenheim', E'Begriffe');
SELECT mill.insert_question(E'Wie wird ein einleitendes Vorwort auch genannt?', E'Prolog', E'Dekalog', E'Epilog', E'Dialog', E'Kultur');
SELECT mill.insert_question(E'Was ist das Gummi in den Gummibärchen?', E'Gelatine', E'Silikon', E'Kautschuk', E'Latex', E'Technik');
SELECT mill.insert_question(E'Wo findet man den Ayers Rock?', E'Australien', E'Südafrika', E'Kanada', E'Neuseeland', E'Geographie');
SELECT mill.insert_question(E'Welchen sagenumwobenen Treueschwur sollen die ersten Schwizer Eidgenossen geleistet haben?', E'Rütlischwur', E'Müeslischwur', E'Rüeblischwur', E'Röstischwur', E'Geschichte');
SELECT mill.insert_question(E'Was bedeutet das "C" im Ozonkiller FCKW?', E'Chlor', E'Ceran', E'Cadmium', E'Caesium', E'Technik');
SELECT mill.insert_question(E'Wewr hatte den Vorsitz beim Wiener Kongress von 1814/15?', E'Fürst Metternich', E'Graf Esterhazy', E'Fürst Pückler', E'Graf Dracula', E'Geschichte');
SELECT mill.insert_question(E'Welches Land hat keine Grenze zu Rumänien?', E'Slowakei', E'Ungarn', E'Bulgarien', E'Ukraine', E'Geographie');
SELECT mill.insert_question(E'Wie lautet der Mädchenname von Jacueline Kennedy-Onnaissis?', E'Bouvier', E'Bricassart', E'Bernadotte', E'Blondel', E'Kultur');
SELECT mill.insert_question(E'Wie nannte man eine landwirtschaftsliche Produktionsgenossenschaft in der Sowjetunion?', E'Kolchose', E'Kolping', E'Kombüse', E'Kommission', E'Geschichte');
SELECT mill.insert_question(E'Wer liefert sich in einem deutschen Volkslied ein Sangesduell mit dem Kickuck?', E'Esel', E'Katze', E'Hahn', E'Hund', E'Musik');
SELECT mill.insert_question(E'Eine populäre Spielart der amerikanischen Volksmusik heißt Country ... ?', E'Western', E'Thriller', E'Comedy', E'Slappstick', E'Musik');
SELECT mill.insert_question(E'Wie sollte - dem titel einer Sammlung von Bach-Stücken nach - ein Klavier sein?', E'wohltemperiert', E'wohlerzogen', E'wohlgeformt', E'wohlbehalten', E'Musik');
SELECT mill.insert_question(E'Wie grüssen Mitglieder des Ferner Fanclubs?', E'Hoi Nils', E'Heil Nils', E'Sali Jan', E'Hallo Jan', E'BBB');


