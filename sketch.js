//three sliders: age, year, gender
//draw to the screen a little person to show the 'lx' value of
//that age group, gender and year
//(500 people = 1 little person)
//and the little people will make bleeping noises
//that can accumulate into a 'crowd' sound

//source of the small man image:
//https://piq.codeus.net/picture/217812/Little-RPG-Person

var year;
var age;
var gender;
var rows = [];
var lxData = [];
var blipArray= [];
var info = 'This page depicts the lx value of New Zealand’s population from the years 1876 - 1983. The lx value is the hypothetical number of people who would survive to a specified age from 100,000 births with that year’s mortality rates. More information about life tables can be found here: https://is.mendelu.cz/eknihovna/opory/zobraz_cast.pl?cast=67138. The data used on this page comes from Stats NZ, and can be downloaded at https://www.stats.govt.nz/large-datasets/csv-files-for-download/ under the name: NZ complete cohort life tables.'


function preload(){
  //load the csv file into a table
  //loadTable(filename, file type, top row is headers)
  table = loadTable('/assets/lifeData2.csv', 'csv', 'header');
  //load two images of little people
  imgF = loadImage('/assets/littlePersonF.png');
  imgM = loadImage('/assets/littlePersonM.png');


}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = table.getRows();
  
  genderSlider = createSlider(0,1,0);
  genderSlider.position(width/4-100,60);
  
  ageSlider = createSlider(0,100,100);
  ageSlider.position(width/2-100,60);

  yearSlider = createSlider(0,107,0);
  yearSlider.position(width*(3/4)-100,60);
  
  //create an array of blipArray objects and set
  //parameters (x, y, frequency) and load
  for(var i = 0; i < 1000; i++){
    blipArray[i] = new BlipperCircle;
    blipArray[i].freq = random(100,800);
    blipArray[i].x = random(50, width-50);
    blipArray[i].y = random(height/4, height*(3/4));

    blipArray[i].load();

  }


}

function draw() {
  background(201, 228, 202);
  fill(135, 187, 162);
  noStroke();
  //beautiful aesthetic rectangles 
  rect(0, 0, width, 100);
  rect(0, height-100, width, height);


  //draw text above sliders that shows what the slider values
  //are as the user changes them
  fill(54, 73, 88);
  textSize(32);
  text(yearSlider.value()+1876, width*(3/4)-50,50);
  text(ageSlider.value(), width/2-50,50);
  textSize(12);
  text('year', width*(3/4)-90,45);
  text('age', width/2-90,45);




  frameRate(60);
  textSize(32);
  
  //the way the csv file is structured makes it necessary to do
  //some maths to navigate to the correct lx value for any
  //gender, year and age
  if(genderSlider.value() === 0){
    //there are 606 entries per year
    year = yearSlider.value()*606;
    //female results come first
    gender = 0;
    //each year of age has 3 values:
    //min, max and average.
    //*3 navigates to the correct age and
    //+2 navigates to the average
    age = (ageSlider.value()*3)+2;
    //show the user we're referring to females
    text('female', width/4-80,50);
  }
  else if(genderSlider.value() === 1){
    year = yearSlider.value()*606;
    //male data begins 303 rows down
    //each year's segment of the file
    //hence:
    gender = 303;
    age = (ageSlider.value()*3)+2;
    //show the user we're referring to males
    text('male', width/4-80,50);
  }

  //add together the various navigational elements to
  //find and set the lx value to a variable, and round
  //it to an integer
  var lxValue = (rows[year+age+gender].get('lx'))/500;
  var roundedlx = int(lxValue);


  for(var i = 0; i < roundedlx; i++){
    blipArray[i].play();
  }
  
  textSize(32);
  text('Number of people: ' + rows[year+age+gender].get('lx'), 10,height-20);
  textSize(12);
  text(info, width-600, height-95, 600, 200);
  text('(1 little person represents 500 people)', 10, height-50);


}



function BlipperCircle(){
  this.x;
  this.y;
  this.freq;
  this.osc;
  this.adsr;
  //a little randomness prevents the sounds the people make
  //from becoming repetative or predictable
  this.randomTimer = int(random(300,400));
  this.randomOffset = int(random(0,400));

  this.load = function(){
    this.osc = new p5.Oscillator();
    this.osc.setType('triangle');
    this.osc.freq(this.freq);
    this.osc.amp(0.1);

    this.adsr = new p5.Env();
    this.adsr.setADSR(0.01, 0.3, 0, 0.5);
    this.osc.amp(this.adsr);


  }

  this.play = function(){

    if(genderSlider.value() === 0){
      image(imgF, this.x, this.y);
    }
    else{
      image(imgM, this.x, this.y);

    }

    //a little cheeky mouse fun
    if(mouseIsPressed && mouseY > 200){
      this.x = this.x + (random(-3,3));
      this.y = this.y + (random(-3,3));
    }
    else{
      this.x = this.x + (random(-1,1));
      this.y = this.y + (random(-1,1));
    }
    
    if((frameCount+this.randomOffset)%this.randomTimer === 0){
      this.osc.start();
      this.adsr.play(this.osc, 0, 0.2);
    }

  }
}
