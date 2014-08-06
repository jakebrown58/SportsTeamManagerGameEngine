var nameGenerator = function(){
	var self = this;
	var myRandomizer = app.randomizer;

	var b = new NameContainer();

	self.getNextFirstName = function(){
		var value = myRandomizer.getRnd( 177 - 1, 0);
		return b.getFName(value);
	}

	self.getNextLastName = function(){
		var value = myRandomizer.getRnd( 81 - 1, 0);
		return b.getLName(value);
	}

	self.getTeamName = function( index){
		return b.getTName(index);
	}
}


var NameContainer = function() {
	if ( NameContainer.prototype._singletonInstance ) {
	  return NameContainer.prototype._singletonInstance;
	}

	NameContainer.prototype._singletonInstance = this;
	var fn = new Array();
	var ln = new Array();
	var tn = new Array();
	this.Init = function(){
		fn.push("Abner");
		fn.push("Abrafo");
		fn.push("Achilles");
		fn.push("Adofo");
		fn.push("Aello");
		fn.push("Aethelbeorn");
		fn.push("Aife");
		fn.push("Ailith");
		fn.push("Ainia");
		fn.push("Ainippe");
		fn.push("Alchesay");
		fn.push("Ajamu");
		fn.push("Ajani");
		fn.push("Ajax");
		fn.push("Akecheta");
		fn.push("Akin");
		fn.push("Akinyemi");
		fn.push("Alaois");
		fn.push("Albern");
		fn.push("Alburn");
		fn.push("Alcibie");
		fn.push("Alcinoe");
		fn.push("Alcippe");
		fn.push("Alemana");
		fn.push("Alexander");
		fn.push("Alfonsia");
		fn.push("Alger");
		fn.push("Alkaia");
		fn.push("Alois");
		fn.push("Aloisia");
		fn.push("Altsoba");
		fn.push("Alvar");
		fn.push("Anaba");
		fn.push("Andreas");
		fn.push("Andrew");
		fn.push("Andromeda");
		fn.push("Ansgar");
		fn.push("Antandre");
		fn.push("Areto");
		fn.push("Ariki");
		fn.push("Arjuna");
		fn.push("Armando");
		fn.push("Armina");
		fn.push("Ashur");
		fn.push("Askari");
		fn.push("Asteria");
		fn.push("Atsushi");
		fn.push("Averill");
		fn.push("Bali");
		fn.push("Baron");
		fn.push("Barron");
		fn.push("Bathilda");
		fn.push("Beadu");
		fn.push("Beadurinc");
		fn.push("Beadutun");
		fn.push("Beaton");
		fn.push("Beda");
		fn.push("Bellatrix");
		fn.push("Beorn");
		fn.push("Bevan");
		fn.push("Bomani");
		fn.push("Bremusa");
		fn.push("Brunhilde");
		fn.push("Bushi");
		fn.push("Cadabyr");
		fn.push("Cadby");
		fn.push("Caddawyc");
		fn.push("Cadman");
		fn.push("Cahira");
		fn.push("Calhoun");
		fn.push("Cammi");
		fn.push("Cenewig");
		fn.push("Cenewyg");
		fn.push("Chadwick");
		fn.push("Chadwik");
		fn.push("Chadwyk");
		fn.push("Cheveyo");
		fn.push("Chlodwig");
		fn.push("Clancy");
		fn.push("Clodovea");
		fn.push("Clodoveo");
		fn.push("Cochise");
		fn.push("Czarine");
		fn.push("Dezba");
		fn.push("Dima");
		fn.push("Diomedes");
		fn.push("Donnachadh");
		fn.push("Donnchadh");
		fn.push("Dreng");
		fn.push("Duncan");
		fn.push("Dustin");
		fn.push("Einar");
		fn.push("Edson");
		fn.push("Eferhild");
		fn.push("Eferhilda");
		fn.push("Eloy");
		fn.push("Elvara");
		fn.push("Elvey");
		fn.push("Elvy");
		fn.push("Eskiminzin");
		fn.push("Fenyang");
		fn.push("Finian");
		fn.push("Finn");
		fn.push("Finnegan");
		fn.push("Galtero");
		fn.push("Gamba");
		fn.push("Geraldo");
		fn.push("German");
		fn.push("Geronimo");
		fn.push("Gervasio");
		fn.push("Gervaso");
		fn.push("Gideon");
		fn.push("Gualterio");
		fn.push("Gunnar");
		fn.push("Gunther");
		fn.push("Haka");
		fn.push("Hangaku");
		fn.push("Hania");
		fn.push("Harb");
		fn.push("Harbin");
		fn.push("Harimanna");
		fn.push("Harimanne");
		fn.push("Hector");
		fn.push("Hehewuti");
		fn.push("Herbert");
		fn.push("Herbert");
		fn.push("Heriberto");
		fn.push("Herod");
		fn.push("Hida");
		fn.push("Hide");
		fn.push("Hilderinc");
		fn.push("Hondo");
		fn.push("Hototo");
		fn.push("Humbert");
		fn.push("Indra");
		fn.push("Ingvar");
		fn.push("Iphito");
		fn.push("Irapeke");
		fn.push("Itaghai");
		fn.push("Jabari");
		fn.push("Jelani");
		fn.push("Juh");
		fn.push("Kamau");
		fn.push("Kane");
		fn.push("Karna");
		fn.push("Katene");
		fn.push("Kemp");
		fn.push("Kempe");
		fn.push("Kenway");
		fn.push("Keon");
		fn.push("Kerbasi");
		fn.push("Khalfani");
		fn.push("Khalon");
		fn.push("Kiaskari");
		fn.push("Kijani");
		fn.push("Kikosi");
		fn.push("Kimball");
		fn.push("Kondo");
		fn.push("Labhaoise");
		fn.push("Lakshmana");
		fn.push("Laran");
		fn.push("Lokela");
		fn.push("Lonzo");
		fn.push("Lothar");
		fn.push("Louisane");
		fn.push("Louise");
		fn.push("Lovisa");
		fn.push("Loyce");
		fn.push("Luana");
		fn.push("Ludwig");
		fn.push("Lugaidh");
		fn.push("Luijzika");
		fn.push("Luise");
		fn.push("Lujza");
		fn.push("Lutalo");
		fn.push("Luthais");
		fn.push("Luther");

		ln.push("Albion");
		ln.push("Anu");
		ln.push("Amayeta");
		ln.push("Aloeus");
		ln.push("Anakim");
		ln.push("Argus");
		ln.push("Athos");
		ln.push("Atlas");
		ln.push("Awarnach");
		ln.push("Azam");
		ln.push("Balor");
		ln.push("Bestla");
		ln.push("Boleslaw");
		ln.push("Brady");
		ln.push("Bris");
		ln.push("Cacus");
		ln.push("Caw");
		ln.push("Celso");
		ln.push("Corb");
		ln.push("Custennin");
		ln.push("Cyclops");
		ln.push("Da-Xia");
		ln.push("Enzo");
		ln.push("Eskaminzim");
		ln.push("Fomors");
		ln.push("Garm");
		ln.push("Geirrod");
		ln.push("Gerd");
		ln.push("Grant");
		ln.push("Gwynfor");
		ln.push("Gwydion");
		ln.push("Hallmar");
		ln.push("Hanska");
		ln.push("Hercules");
		ln.push("Humberto");
		ln.push("Hyndla");
		ln.push("Jarnsaxa");
		ln.push("Jupiter");
		ln.push("Kabandha");
		ln.push("Kapre");
		ln.push("Kentaro");
		ln.push("Kwatoko");
		ln.push("Kyo");
		ln.push("Langston");
		ln.push("Latiaran");
		ln.push("Loki");
		ln.push("Magnus");
		ln.push("Montaro");
		ln.push("Morven");
		ln.push("Myrrdin");
		ln.push("Nagendra");
		ln.push("Naira");
		ln.push("Olvadi");
		ln.push("Olwyn");
		ln.push("Oghma");
		ln.push("Oni");
		ln.push("Quetzlcoatl");
		ln.push("Reis");
		ln.push("Rion");
		ln.push("Rudianos");
		ln.push("Sequioa");
		ln.push("Skadi");
		ln.push("Skathi");
		ln.push("Tai");
		ln.push("Tarvos");
		ln.push("Taranis");
		ln.push("Tethra");
		ln.push("Thiazi");
		ln.push("Tiamat");
		ln.push("Titania");
		ln.push("Tito");
		ln.push("Titus");
		ln.push("Vargovie");
		ln.push("Vipal");
		ln.push("Virat");
		ln.push("Vishal");
		ln.push("Votan");
		ln.push("Windigo");
		ln.push("Wollunqua");
		ln.push("Ysbaddaden");
		ln.push("Zipacna");

		tn = ['Antelopes', 'Bears', 'Crickets', 'Dolphins', 'Elephants', 'Falcons', 'Gulls', 'Hawks',
			'Archdukes', 'Barons', 'Counts', 'Dutchmen', 'Earls', 'Knights', 'Guards', 'Halbrediers'];
	}

	this.getFName = function(index){
		if( fn.length === 0)
			this.Init();
		return fn[index];
	}

	this.getLName = function(index){
		if( ln.length === 0)
			this.Init();
		return ln[index];
	}

	this.getTName = function(index){
		if( tn.length === 0)
			this.Init();
		return tn[index];
	}
};
