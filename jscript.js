window.onload = ( function () {

'use strict';

    var correctTiles=0; //always start at 0 count

 var tile;  // the 'tile' variable stands for the grabbed puzzle piece 
  
  var clockDisplay; //variable for the repeatable interval counting down the alloted time to solve puzzle

  var count=document.getElementById('count'); //DIV that will diaplay the number of correct tiles in the puzzle

  var piecesArea=document.getElementById('piecesArea'); //the area that will hold puzzle pieces

  var start=document.getElementsByClassName("start")[0]; //the 'start' button
  var stop=document.getElementsByClassName("stop")[0];   //the 'stop' button
  var reset=document.getElementsByClassName("reset")[0]; //the 'reset' button

  var theHint=document.getElementsByClassName('hint')[0]; //the 'hint' button
  var puzzleHint=document.getElementById('puzzleHint'); //DIV that shows the solved puzzle as a hint
  var hintCount=0; //variable to keep track of the number of hints given in a particular session

  var tileHoles=document.getElementsByClassName("tiles"); //The circle divs into which puzzle pieces are dropped

  var level=document.getElementById('level');//DIV giving instructions for player to choose a difficulty level

  var levelChoice=document.getElementsByName('level');// input choices for setting difficulty level

  var choice=''; //variable that holds the difficulty level chosen by player, i.e.'easy', 'medium', or 'hard'
  
  var tileArray=[]; //array where elements will be held

  tileArray = createTiles(tileArray,tileHoles);


  function createTiles(tileArray, tileHoles){//function to create the tiles to populate the piecesArea
  
  var piece;//will hold the IMG eleent


  for(var i=0; i<41; i++){ //create 41 pieces

      piece=document.createElement("IMG"); //IMG element container
      piece.setAttribute("class", "piece "+tileHoles[i].id); //set the class
      piece.setAttribute("id", "piece"+(i+1));//set the id
      piece.setAttribute("src", "Hexagon_puzzle/piece"+(i+1)+".png");//set the source
      piece.setAttribute("draggable", "true"); ///set the draggable attribute
      piece.setAttribute("ondragstart","dragstart_handler(event)"); //set the ondragstart attribute
      tileArray.push(piece);//push each created element to the array
    } 

    return tileArray; //return thearray
}

  /*This is what happens when user clicks on the reset button*/
  reset.addEventListener('click',function(){
     
    var congratsMessage=document.getElementById('congrats'); //holds div displaying the congrulations message
    var outOfTimeMessage=document.getElementById('outOfTime');//holds div displaying the out of time message
    var clock=document.getElementById('clock'); //holds the actual countdown timer viewd by user
    
    puzzleHint.style.display = 'block';

    remove(tileHoles);

    if(congratsMessage){ //will remove congratulatory div if it exists
      congratsMessage.parentNode.removeChild(congratsMessage);
    };
    if(outOfTimeMessage){ //will remove time out message div if it exists
      outOfTimeMessage.parentNode.removeChild(outOfTimeMessage);
    };
    correctTiles = 0;
    clock.innerHTML="0:00";// clock gets reset to '0:00'
    start.style.display="block"; //display the 'start' button again
    level.style.display='block'; //display the div for choosing difficulty level
    reset.style.display='none';  //hide the 'reset' button
  })

/*This is what happens when the player 'mouses down' on the 'hint' button*/
  theHint.addEventListener('mousedown',function(){
    
     if(choice==='easy'){//'easy' level will only display 3 hints per session
       if(hintCount<3 ){
         puzzleHint.style.display='block';
       }; 
     } else if(choice==='medium'){ //'medium' level will display 1 hint per session
           if(hintCount<1){
              puzzleHint.style.display='block';
           };
      };

     hintCount++; //keep track of how many hints have been given 
  });

/*This is what happens when player lifts finger from the 'hint' button*/
  theHint.addEventListener('mouseup',function(){
    
    puzzleHint.style.display='none';

  });

/*This is what happens if the player tries to keep 'hint' button pressed while moving pointer away from that button*/
  theHint.addEventListener('mouseout',function(){
    
    puzzleHint.style.display='none';
  })


/*This is what happens when player clicks on the 'stop' button*/
  stop.addEventListener('click',function(){
    
    correctTiles = 0;
    count.innerHTML = correctTiles;
    remove(tileHoles); //puzzle is solved
    puzzleHint.style.display = 'block';
    stopClock(clockDisplay);//clock is stopped
    stop.style.display="none"; //stop button goes away
    theHint.style.display="none";//hint button goes away
    reset.style.display="block";//reset button appears
  })

/*This is what happens when theplayer clicks on the 'start' button*/
  start.addEventListener('click',function(){


    puzzleHint.style.display = 'none';

    correctTiles=0;

    var puzzleArea=document.getElementById('puzzleArea'); //holds the div area where pieces will go to solve the puzzle

    /*Displays instructive prelimiary messages prior to actual game start, per chosen level*/
    if(levelChoice[0].checked){ 
      choice='easy';
      alert("Start in "+choice+ " mode. You get 3 Hints. Hold Mouse Button DOWN for Hint.");
    } else if(levelChoice[1].checked){
        choice='medium';
        alert("Start in "+choice+ " mode. You get 1 Hint. Hold Mouse Button DOWN for Hint.");
    } else if(levelChoice[2].checked){
        choice='hard';
        alert("Start in "+choice+ " mode. You get 0 Hints");
    } else{ //The default level chosen, if user does not select one, will be the 'easy' level
        choice='easy';
        alert("Start in "+choice+ " mode. You get 3 Hints. Hold Mouse Button DOWN for Hint.");        
    };

    
    clock(); //The clock function runs to start the clock
    scramble();//The scramble function runs to create scrambled pieces at the bottom of the screen

    start.style.display="none"; //'start' button goesaway
    level.style.display='none'; //div displaying difficulty level choices goes away

    /*The 'hint' and 'stop' buttons are shown*/
    theHint.style.display="inline-block"; 
    stop.style.display="inline-block";


   requestAnimationFrame(function() {
        count.innerHTML = correctTiles;
   })

  })


function random(){ //Function to create a random array that will be used to dictate the scrambled position of puzzle pieces
  
  var arr=[]; //arr will hold numbers from 1 through 41, according to their position in the array
  var randomArr=[]; //will hold numbers 1 through 41
  var r;
  arr[0]=null; //The first element @ position 0 will be null, as the randomArr will only hold numbers 1 through 41
  for(var i=1;i<42;i++){arr.push(i)};//push numbers 1 through 41 into arr

  for(var i=1; i<42;i++){//for each element from 1 through 41
    r=Math.ceil(Math.random()*41); //create a random number from 1 through 41
    while(arr[r]===null){ //if the random number created was already picked, then pick another, and keep trying untiil a random number not yet chosen is picked
      r=Math.ceil(Math.random()*41);
    }
    randomArr.push(r);//push the random number into the randomArr array, the array will hold unique random numbers from 1 through 41
    arr[r]=null; //once a unique random number mathch it to the position in the 'arr' array and set that element to 'null' to denote that this number has already been picked
  };
  return randomArr; //return array holding unique random numbers from 1 through 41
}

function remove(tileHoles){ //function to remove all puzzle pieces from the screen
  
  for(var i=0;i<tileHoles.length;i++){ //for all the puzzle piece holes on the puzzle board
    if(tileHoles[i].childNodes.length !==0){ //if the hole holds a piece inside
      tileHoles[i].removeChild(tileHoles[i].childNodes[0]);  //remove it     
    }
  }

  var j=piecesArea.children.length-1; //number of pieces in the piecesArea, the area from which player selects pieces
  if(j!==0){//if number of pieces in piecesArea is not zero
    while(j>=0){ //while there are still pieces in the piecesArea
    
      piecesArea.removeChild(piecesArea.children[j]);//remove each piece
      j--; //decrement the number of pieces in the pieces area

    }

  }
}


function scramble(){ //funciton to scramble the puzzle pieces
  
  var randomPiece = random(); //holds the array of random numbers from 1 through 41
  var puzzleTiles = tileArray;//holds the ordered tiles created 
  var fragmentArea = document.createDocumentFragment();

  for(var i=0;i<41;i++){ //grab the random numbered piece and append it to the piecesArea
    puzzleTiles[randomPiece[i]-1].removeAttribute("style");
    fragmentArea.appendChild(puzzleTiles[randomPiece[i]-1]);
  };
  requestAnimationFrame(function(){
      piecesArea.appendChild(fragmentArea);
  })

}


  function dragstart_handler(event){ //what happens as soon as a drag starts
    
    tile=event.target; //the grabbed piece becomes the 'tile'
    event.dataTransfer.setData("image/png", event.target);//the thumb image during drag

  }

  function dragover_handler(event){ //what happens when the drag is done
    
    event.preventDefault(); //prevent the default in order to specify the drop behavior
  }

  function checkCorrectTiles(tileHoles,tile){//check the number of tiles that are correctly placed
    

   if(tileHoles.classList.contains('piece')){
     if(tileHoles.classList.contains(tileHoles.parentNode.id) && tile.classList.contains(tile.parentNode.id)){
      correctTiles -=2;
    } else if(tileHoles.classList.contains(tileHoles.parentNode.id) || tile.classList.contains(tile.parentNode.id)){
      correctTiles--;
    } else if(tile.classList.contains(tileHoles.parentNode.id) && tileHoles.classList.contains(tile.parentNode.id)){
        correctTiles+=2;
     } else if(tile.classList.contains(tileHoles.parentNode.id) || tileHoles.classList.contains(tile.parentNode.id)){
        correctTiles++;
     }
   } else if(tile.classList.contains(tileHoles.id)){//check to see if the piece is correct for the hole
          correctTiles++;//if it is, count it as correcct and increment the 'correctTiles' counter
        } else if(tile.classList.contains(tile.parentNode.id)){
          correctTiles--;
        }

    return correctTiles; //return the count
  }



  function drop(event){ //what happens when a tile is dropped
    
    event.preventDefault(); //prevent default to specify custom behavior

    var correct = checkCorrectTiles(event.target,tile);

  
    if(choice==='easy'){  //check to see if 'easy' level was chosen

      if(tile.classList.contains(event.target.id)){ //in easy mode only the correct piece will be allowed to be dropped in the puzzle circle space
         
        tile.parentNode.removeChild(tile); //remove the puzzle piece grabbed from the piecesArea
        event.target.appendChild(tile); //append the piece to the puzzle circle area
        

        if(correct===41){ //check to see if puzzle has been completed
          stopClock(clockDisplay);//if so, stop the clock
          setTimeout(function(){congrats();},3000);//wait 3 seconds and then run congratulatory function
        };
        count.innerHTML = correct;//calculate and display the number of correct puzzle pieces after each drop
      };

    } else{ //for any of the other levels, 'medium', or 'hard'

        if (event.target.classList.contains("piece") && event.target!==tile){ //check to see if grabbed piece is going onto another piece and that piece is not itself


          var fromPosition=tile.parentNode.id; //the parent node of the grabbed piece id is saved
          var toPosition=event.target.parentNode.id;//the parent node of the destination position is saved
          
          var tileClone=tile.cloneNode(); //the grabbed piece is cloned and saved
          tile.parentNode.removeChild(tile);//after the clone of grabbed piece is made, that grabbed piece is deleted from the original position

          var tileTargetClone=event.target.cloneNode();//the destination piece onto which the originally grabbed piece will be dropped is saved
          event.target.parentNode.removeChild(event.target);//once saved, the destination piece is removed
          
          //the pieces then swap positions
          document.getElementById(fromPosition).appendChild(tileTargetClone);
          document.getElementById(toPosition).appendChild(tileClone);
        
          if(correct===41){ //check to see if puzzle is complete
            stopClock(clockDisplay);//if so stop the clock
            setTimeout(function(){congrats();},3000);//wait 3 seconds to run congratulatory function
          };
          count.innerHTML=correct;//calculate and display the number of correct puzzle pieces after each drop

        } else if(event.target!==tile){ //if the puzzle piece is NOT going onto another piece and it is not going onto itself
            tile.parentNode.removeChild(tile);//remove the grabbed piece from original location
            event.target.appendChild(tile); //apppended to new destination

            if(correct===41){ //check if the puzzle is solved
              stopClock(clockDisplay);  //if solved, stop the clock
              setTimeout(function(){congrats();},3000);//wait 3 seconds and then run the contratulatory function
            };
            count.innerHTML=correct--;//calculate and display the number of correct puzzle pieces after each drop
          }
    }

  }


  function outOfTime(){ //function to run when player runs out of time

    
    var piece=document.getElementsByClassName('piece'); //container for the pieces on the screen
    
    for(var i=0; i<piece.length;i++){ //for each of the pieces on the screen
      //pieces will be positioned to appear as if they are being flung or scattered out of view
      if(i%2===0){
        piece[i].setAttribute("style", "transform: translate3d("+Math.ceil(1000+Math.random()*1000)+"px,"+Math.ceil(1000+Math.random()*1000)+"px,"+Math.ceil(1000+Math.random()*1000)+"px); transition: transform "+Math.ceil(Math.random()*5)+"s;");
      } else if(i%3===0){
        piece[i].setAttribute("style", "transform: translate3d("+Math.ceil(1000+Math.random()*1000)+"px,-"+Math.ceil(1000+Math.random()*1000)+"px,"+Math.ceil(1000+Math.random()*1000)+"px); transition: transform "+Math.ceil(Math.random()*5)+"s;");
      } else {
        piece[i].setAttribute("style", "transform: translate3d(-"+Math.ceil(1000+Math.random()*1000)+"px,-"+Math.ceil(1000+Math.random()*1000)+"px,-"+Math.ceil(1000+Math.random()*1000)+"px); transition: transform "+Math.ceil(Math.random()*5)+"s;");
      } 
      
    }
    //a DIV holding the out of time message to be displayed to the user is created, appendedto the body and position inside the window
    var outOfTimeDiv=document.createElement("DIV");
    var text=document.createTextNode("Ran Out Of Time, Better Luck Next Time!");
    outOfTimeDiv.appendChild(text);
    document.body.appendChild(outOfTimeDiv);
    outOfTimeDiv.setAttribute("id","outOfTime");
    outOfTimeDiv.style.position="absolute";
    outOfTimeDiv.style.top="700px";
    outOfTimeDiv.style.left="550px";
    outOfTimeDiv.style.border="1px solid white";
    outOfTimeDiv.style.zIndex="5000";
    outOfTimeDiv.style.color="white";
    outOfTimeDiv.style.fontSize="2.5em";
    outOfTimeDiv.style.margin="auto";

    stop.style.display="none"; //stop button is hidden
    theHint.style.display="none"; //hint button is hidden
    reset.style.display="block"; //only the reset button 

  }


  function congrats(){ //congratulatory function

    

    var piece=document.getElementsByClassName('piece'); //container for all puzzle pieces on the screen

   
    for(var i=0; i<piece.length;i++){ //for each of the pieces, spin them at different random times within 10 seconds
      piece[i].style.transform="rotateY(360deg)";
      piece[i].style.transition="transform "+Math.ceil(Math.random()*10)+"s";
    }

    //congratulatory message is created, appended to the puzzle area and positioned
    var messageDiv=document.createElement('DIV');
    var message=document.createTextNode("CONGRATULATIONS!!!");
    
    messageDiv.setAttribute("id","congrats");
    messageDiv.style.fontSize="1.5em";
    messageDiv.style.border="1px solid white";
    messageDiv.style.width="500px";
    messageDiv.style.height="200px";
    messageDiv.style.color="white";
    messageDiv.style.left="200px";
    messageDiv.style.zIndex="5000";
    messageDiv.style.top="-500px";
    messageDiv.style.position="relative";
    messageDiv.style.textAlign="center";
    messageDiv.appendChild(message);
    puzzleArea.appendChild(messageDiv);

    stop.style.display="none";//hide the stop button
    theHint.style.display="none";//hide the hint button
    reset.style.display="block";//only display the reset button

  }

  function stopClock(clockDisplay){//function to stop the clock
    
    clearInterval(clockDisplay);
  }

  function clock(){//function for the timer that the user will see counting down the time left to solve the puzzle
    
    

    var clock=document.getElementById('clock'); //the div displaying the count down timer

    var time=0; //holds how long the allowed time will be, 2 seconds added to time to account for lag time to show on screen after 'start' button clicked

    if(choice==='easy'){
      time=902000; //15 minutes alloed for 'easy' level
    } else if(choice==='medium'){
      time=602000;//10 minutes allowed for 'medium' level
    } else if(choice==='hard'){
      time=302000;//5 minutes allowed for 'hard' level
    }


    var startTime= new Date().getTime(), //computer time at the start of function
        onGoingClock=startTime + time; //computer time plus the alloted time
 

    clockDisplay=setInterval(function(){ //count down interval

        var onGoingTime=new Date().getTime(); //the time computed for each interval

       var allotedTime= onGoingClock - onGoingTime;//intantaneous up to the second alloted time
       

       //calculation of minutes and seconds
      var minutes=Math.floor((allotedTime % (1000*60*60))/(1000*60)); 
      var seconds=Math.floor((allotedTime % (1000*60))/(1000));

      
      clock.innerHTML=minutes+':'+(seconds < 10 ? '0' : '') + seconds;//display of time remaining at each interval
      
      if(allotedTime<1){ //what to do if time runs out

        stopClock(clockDisplay); //stop the cloock
        clock.innerHTML='0:00'; //display 0:00
        outOfTime(); //run the outOfTime function
      }


    },1000) //one second interval

}

window.dragover_handler = dragover_handler;
window.dragstart_handler = dragstart_handler;
window.drop = drop;

 }(window.console));