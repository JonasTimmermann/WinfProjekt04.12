import { Component, OnInit } from '@angular/core';
import {HttpRequestService} from '../http-request.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {




  url = 'http://localhost:8080/frage';


  url3 = 'http://localhost:8090/frage';

  urlAdd = 'http://localhost:8090/frage/add';
  
  urlById: number = -1;
  urlGetbyId = 'http://localhost:8090/frage/' + this.urlById;

  formType: string = ""; 
  urlFormType = 'http://localhost:8090/type/' + this.formType;

  

// Url für die Kategorien-Methoden (mit String als Parameter) 
  formTypeCat: string = ""; 
  categoryCat: string = ""; 
  urlFormTypeCategory = 'http://localhost:8090/type/' + this.formTypeCat + '/category/' + this.categoryCat;
  urlCategory = 'http://localhost:8090/category/' + this.categoryCat;

// Url und Id's für die Bearbeitungs-Methoden 
  editId: number = -1;
  urlEdit: string = 'http://localhost:8090/frage/' + this.editId + '/edit';

  editIdNext: number = -1;
  urlEditNext: string = 'http://localhost:8090/frage/' + this.editId + '/addfollowing';
 

// Url und Id für die Lösch-Methode 
  deleteIdQuestion = -1;
  urlDelete = 'http://localhost:8090/frage/' + this.deleteIdQuestion + '/delete';



  chosenFormType: string = "";
  chosenFormTypeCat: string = "";
  chosenCategoryCat: string = "";

  catOn: boolean = false;


// Any-Objekte zum speichern der Daten aus GET-Requests
  public data: any;

  public dataOne: any;
  byIdOn: boolean = false;

  public data4: any;

  public dataSet =  new Set();
  public dataSetCat =  new Set();

  public dataDisplay: any;



antwortMoeglichkeiten: Kategorien[] = [];

// Booleans für die getätigte Auswahl bei Antwort-Typ
radioOn: boolean = false;
CheckOn: boolean = false;
TextOn: boolean = false;
TextCheckOn: boolean = false;
deleteOn:boolean = false;
editOn: boolean = false;

// Anzahl der aktuellen Antwort-optionen und Kategorien
antOpAnzahl: number = 1;

catOpAnzahl: number = 1;



// Arrays zum Speichern der Choices und Kategorien und die Ausgabe in Html
fakeArray = new Array(this.antOpAnzahl);
realArray = new Array<String>(this.fakeArray.length);
fakeChoiceArray = new Array(this.antOpAnzahl);
choiceArray = new Array<Choices>(); 
choiceExample: Choices = {id: 0, choice: "", nextQuestionId: null, questionType: null};
fakeCategoryArray = new Array(this.catOpAnzahl);
categoryArray = new Array<QuestionCategory>();



antOpString: string = "";

question: Question = {id: 0, question: "Was ist dein Alter", questionType: null, hint: "no Hinweis", formType: "Gewerbe", questionCategory: null};

choices: Choices = {id: 0, choice: "", nextQuestionId: null, questionType: null};

chArray: Choices[] = [this.choices];

questionType: QuestionType = {id: 0, type: "", nextQuestionId: null, choices: this.chArray }; 

questionCategory: QuestionCategory = {id: 0, category: "", processNumber: 1}; 


qtArray: QuestionType[] = [this.questionType];
qcArray: QuestionCategory[] = [this.questionCategory];

currentId:number = 0;
check:boolean = false;




constructor(private api: HttpRequestService) { }





ngOnInit() {



this.antwortMoeglichkeiten = [{id: 1, name: "Text-Eingabe"},{id: 2, name: "RadioButton"},{id: 3, name: "Checkbox"}, {id: 4, name: "Text u. Checkbox"}];


this.antOpAnzahl = 1;
this.catOpAnzahl = 1;

this.chosenFormType = "";
this.chosenFormTypeCat = "";
this.chosenCategoryCat = "";



let chbsp: Choices = {id: 0, choice: "", nextQuestionId: null, questionType: null};
this.choiceArray.push(chbsp);

let catbsp: QuestionCategory = {id: 0, category: "", processNumber: 0};
this.categoryArray.push(catbsp);
console.log(this.categoryArray);

this.question = {id: 2, question: "Frage eingeben", questionType: this.questionType, hint: "", formType: "Gewerbean u. umeldung", questionCategory: this.qcArray};

this.dataOne = this.question;


this.api
.getQuestion(this.url3)
.subscribe(
  dataDisplay => {
    console.log(dataDisplay);
    this.dataDisplay = dataDisplay;
    this.data = dataDisplay;

    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie");
    for(let u1 = 0; u1 < dataDisplay.length; u1++){
      for(let u2 = 0; u2 < dataDisplay[u1].questionCategories.length; u2++){
        this.dataSetCat.add(dataDisplay[u1].questionCategories[u2].category);
    }
  }
    console.log(this.dataSetCat);

    this.dataSet =  new Set<String>();
    this.dataSet.add("Alle Fragen");
    for(let u = 0; u < dataDisplay.length; u++){
      this.dataSet.add(dataDisplay[u].formType);
    }
    console.log(this.dataSet);

  },
  err => {
    console.log(err);
  }
);

}

// wird ausgeführt wenn ein Antwort-Typ ausgewählt wird
  toggleEdit(){

    if(this.question.questionType.type == "RadioButton"){
      this.radioOn = true;
    }else{
      this.radioOn = false;
    }

    if(this.question.questionType.type == "Checkbox"){
      this.CheckOn = true;
    }else{
      this.CheckOn = false;
    }

    if(this.question.questionType.type == "Text-Eingabe"){
      this.TextOn = true;
    }else{
      this.TextOn = false;
    }

    if(this.question.questionType.type == "Text u. Checkbox"){
      this.TextCheckOn = true;
    }else{
      this.TextCheckOn = false;
    }

      //this.isEdit = !this.isEdit;
    
  }

// Für den Filter (Filtern nach Formular-Art und dann nach deren Kategorie)
changeCatOn(): void{

    this.catOn = true;
    this.dataSetCat =  new Set<String>();
    this.dataSetCat.add("keine Kategorie");
    for(let t = 0; t < this.data.length; t++){
     
      if(this.chosenFormTypeCat == this.data[t].formType){
        
        for(let g = 0; g < this.data[t].questionCategories.length; g++){

          this.dataSetCat.add(this.data[t].questionCategories[g].category);
        }
      }

    }

    this.chosenCategoryCat = "keine Kategorie";
    this.getAllQuestionsOfFormTypeWithinCategory();
  }


// Bei Klick auf eine Der Fragen aus dem Fragekatalog werden die Daten der geklickten Frage geladen
  loadQuestion(question: any): void {
    
    this.deleteIdQuestion = question.id;  
    this.deleteOn = true;
    this.editOn = true;
  
    this.question.question = question.question;
    this.question.id = question.id;
    this.question.hint = question.hint;
    this.question.questionType = question.questionType;
    this.question.questionCategory = question.questionCategories;
    this.question.formType = question.formType;

    this.toggleEdit();
    //console.log(question.questionCategories);
    this.categoryArray = question.questionCategories;
    this.choiceArray = question.questionType.choices;
    //console.log(this.choiceArray);console.log(this.categoryArray);
    this.fakeChoiceArray = new Array(this.choiceArray.length);
    this.fakeCategoryArray = new Array(this.categoryArray.length);
    this.antOpAnzahl = this.choiceArray.length
    this.catOpAnzahl = this.categoryArray.length

  }



createQuestion(): void{

  this.api
.getQuestion(this.url3)
.subscribe(
  data => {
    console.log(data);
    this.data = data;
    this.dataDisplay = data;

    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie")
    for(let u1 = 0; u1 < data.length; u1++){
      for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
      this.dataSetCat.add(data[u1].questionCategories[u2].category);
    }
  }
    console.log(this.dataSetCat);

    this.dataSet =  new Set<String>();
    this.dataSet.add("Alle Fragen");
    for(let u = 0; u < data.length; u++){
      this.dataSet.add(data[u].formType);
    }
    console.log(this.dataSet);

  },
  err => {
    console.log(err);
  }
);


if(!this.check){
  if(this.data.length > 0){  
    this.currentId = this.data[this.data.length -1].id + 1;
    this.question.id = this.currentId;
  }else{
    this.question.id = 1;
  }
 
  //this.questionType = {id: 0, type: "RadioButton2", choices: this.chArray, question: this.question };
  //this.questionCategory= {id: 0, category: "Allgemeines", questions: this.quArray, processNumber: 1};
  //this.qtArray = [this.questionType];
  //this.qcArray = [this.questionCategory];
  //this.question = {id: 2, question: "dein Alter hier eintragen", questionType: this.questionType, hint: "no Hinweis vorhanden", formType: "Gewerbean u. umeldung", questionCategory: this.qcArray};
  let zt: number = this.data[this.data.length - 1].questionType.id + 1;

  let questionZw: QuestionType = {id: zt, type: this.question.questionType.type, nextQuestionId: null, choices: this.choiceArray}; 

  //this.questionType = {id: 0, type: "RadioButton2", choices: this.chArray, question: this.question };
  //this.questionType.choices = this.choiceArray;
  //this.questionType.question = this.question;
  this.question.questionType = questionZw;

  let categoryZw: QuestionCategory[] = this.categoryArray;
  this.question.questionCategory = this.categoryArray; //categoryZw;
  //console.log("Länge: " + this.question.questionCategory.length);
  this.dataSet.add(this.question.formType);

  for(let u1 = 0; u1 < this.question.questionCategory.length; u1++){
    
    this.dataSetCat.add(this.question.questionCategory[u1].category);
  
}
  

// Für die Post-Methode werden einige Attr. der Question nicht gebraucht, und daher werden hier neue Objekte nur mit den relevanten Attr. erstellt
  // Die Objekte von den "GET"-Methoden werden gekürtzt (Id's werden gelöscht) für die Post/Put-methoden
  let dataShortChoices: ChoicesShort[] = [];
    for(let r = 0; r < this.question.questionType.choices.length; r++){
      dataShortChoices.push({choice: this.question.questionType.choices[r].choice} );//,nextQuestionId: this.question.questionType.choices[r].nextQuestionId});
    }
      
    let dataShortQuestionType: QuestionTypeShort;
    dataShortQuestionType = {type: this.question.questionType.type, choices: dataShortChoices}; //,nextQuestionId: this.question.questionType.nextQuestionId};

    let dataShortCategory: QuestionCategoryShort[] = [];
    for(let r = 0; r <this.question.questionCategory.length; r++){
      dataShortCategory.push({category: this.question.questionCategory[r].category, processNumber: this.question.questionCategory[r].processNumber});
    console.log("Kat: " + this.question.questionCategory[r].category);
    }
   
    let dataShort: QuestionShort;

    dataShort = {question: this.question.question, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory };

    //console.log(dataShort.questionCategories);
    //console.log(dataShort);

  this.api.addQuestion(dataShort, this.urlAdd).subscribe(data => {console.log(data); this.data = data; this.dataDisplay = data;}, err => {console.log(err);});

}
 location.reload();

}





getAllQuestion(): void {

  this.api.getQuestion(this.url3).subscribe(data => {console.log(data);this.data = data; this.dataDisplay = data; 
    

    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie")
        for(let u1 = 0; u1 < data.length; u1++){
          for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
            this.dataSetCat.add(data[u1].questionCategories[u2].category);
          }
        }
    this.dataSet =  new Set<String>();
    this.dataSet.add("Alle Fragen");
    for(let u = 0; u < data.length; u++){
        this.dataSet.add(data[u].formType);
      }
      console.log(this.dataSet);

      },err => {console.log(err);});
  
}




getQuestionById(): void {
  
  let zw: boolean = false;
  for(let i = 0; i < this.data.length; i++){
      
     if(this.urlById == this.data[i].id){
        zw = true;  
     }
  }

  if(zw){
    this.urlGetbyId = 'http://localhost:8090/frage/' + this.urlById;

    this.api.getQuestionbyId(this.urlGetbyId).subscribe(dataOne => {console.log(dataOne);this.dataOne = dataOne;},err => {console.log(err);});
  
    this.byIdOn = true;
  }
}



getFormType(): void{

  let zw: boolean = false;

  for(let i = 0; i < this.data.length; i++) {
      
     if(this.chosenFormType == this.data[i].formType){
        zw = true;  
     }
  }

  if(zw){

    this.formType = this.chosenFormType;
    this.urlFormType = 'http://localhost:8090/type/' + this.formType;

    this.api.getFormType(this.urlFormType).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
    
  }

}



getCategory(): void{


    this.categoryCat = this.chosenCategoryCat; 
    console.log(this.chosenCategoryCat);
    this.urlCategory = 'http://localhost:8090/category/' + this.categoryCat;

    this.api.getFormType(this.urlCategory).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
    
  }



getAllQuestionsOfFormTypeWithinCategory(): void {


  if(this.chosenFormTypeCat == "Alle Fragen"){
    if(this.chosenCategoryCat != "keine Kategorie"){
      
        this.getCategory();

      }else{

      	this.getAllQuestion();
      
    }

  }else{
    if(this.chosenCategoryCat == "keine Kategorie"){
  
      this.formType = this.chosenFormTypeCat;
      this.urlFormType = 'http://localhost:8090/type/' + this.formType;
  
      this.api.getFormType(this.urlFormType).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
      
    }else{

      this.formTypeCat = this.chosenFormTypeCat; 
      this.categoryCat = this.chosenCategoryCat; 
      this.urlFormTypeCategory = 'http://localhost:8090/type/' + this.formTypeCat + '/category/' + this.categoryCat;

      this.api.getAllQuestionsOfFormTypeWithinCategory(this.urlFormTypeCategory).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
    }
  }

}






//AddNextQuestionId
editQuestionNextQuestionId(): void{
    
  let questionZw: QuestionType = {id: this.question.questionType.id, type: this.question.questionType.type, nextQuestionId: this.question.questionType.nextQuestionId, choices: this.choiceArray}; //, question: this.question 
  //let questionZw: QuestionType = {id: this.question.questionType.id, type: this.question.questionType.type, nextQuestionId: 10, choices: this.choiceArray}; //, question: this.question 
  //this.questionType.choices = this.choiceArray;

  this.question.questionType = questionZw;
  
  let categoryZw: QuestionCategory[] = this.categoryArray;
  this.question.questionCategory = this.categoryArray;//categoryZw;

  this.editId = this.question.id;
  this.urlEditNext = 'http://localhost:8090/frage/' + this.editId + '/edit';



// Die Objekte von den "GET"-Methoden werden gekürtzt (Id's werden gelöscht) für die Post/Put-methoden
    let dataShortChoices: ChoicesShortNext[] = [];
    for(let r = 0; r < this.question.questionType.choices.length; r++){
      dataShortChoices.push({choice: this.question.questionType.choices[r].choice, nextQuestionId: this.question.questionType.choices[r].nextQuestionId} );//,nextQuestionId: this.question.questionType.choices[r].nextQuestionId});
    }
      
    let dataShortQuestionType: QuestionTypeShortNext;
    dataShortQuestionType = {type: this.question.questionType.type, nextQuestionId: this.question.questionType.nextQuestionId, choices: dataShortChoices}; //,nextQuestionId: this.question.questionType.nextQuestionId};

    let dataShortCategory: QuestionCategoryShortNext[] = [];
    for(let r = 0; r < this.question.questionCategory.length; r++){
      dataShortCategory.push({category: this.question.questionCategory[r].category, processNumber: this.question.questionCategory[r].processNumber});
    }

    let dataShort: QuestionShortNext;
    dataShort = {question: this.question.question, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory };
 
    this.api.editQuestionNext(this.urlEditNext, dataShort, this.editId).subscribe(data => {console.log(data);this.data = data;this.dataDisplay = data;
      
      this.dataSetCat = new Set<String>();
      this.dataSetCat.add("keine Kategorie")
      for(let u1 = 0; u1 < data.length; u1++){
        for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
          this.dataSetCat.add(data[u1].questionCategories[u2].category);
        }
      }
          this.dataSet =  new Set<String>();
          this.dataSet.add("Alle Fragen");
          for(let u = 0; u < data.length; u++){
            this.dataSet.add(data[u].formType);
          }
          console.log(this.dataSet);

    },err => {console.log(err);});
  
  this.editOn = false;
  this.deleteOn = false;

  location.reload();
  
}
//___________________________________________________________________________________________________________________


/** Put-Methode ohne NextQUestionId
editQuestion(): void{
    
  let questionZw: QuestionType = {id: this.question.questionType.id, type: this.question.questionType.type, nextQuestionId: this.question.questionType.nextQuestionId, choices: this.choiceArray}; //, question: this.question 

  //this.questionType.choices = this.choiceArray;
  //this.questionType.id = 20;
  this.question.questionType = questionZw;
  
  let categoryZw: QuestionCategory[] = this.categoryArray;
  this.question.questionCategory = this.categoryArray;//categoryZw;

  this.editId = this.question.id;
  this.urlEdit = 'http://localhost:8090/frage/' + this.editId + '/edit';

// Die Objekte von den "GET"-Methoden werden gekürtzt (Id's werden gelöscht) für die Post/Put-methoden
    let dataShortChoices: ChoicesShort[] = [];
    for(let r = 0; r < this.question.questionType.choices.length; r++){
      dataShortChoices.push({choice: this.question.questionType.choices[r].choice} );//,nextQuestionId: this.question.questionType.choices[r].nextQuestionId});
    }
      
    let dataShortQuestionType: QuestionTypeShort;
    dataShortQuestionType = {type: this.question.questionType.type, choices: dataShortChoices}; //,nextQuestionId: this.question.questionType.nextQuestionId};

    let dataShortCategory: QuestionCategoryShort[] = [];
    for(let r = 0; r < this.question.questionCategory.length; r++){
      dataShortCategory.push({category: this.question.questionCategory[r].category, processNumber: this.question.questionCategory[r].processNumber});
    }

    let dataShort: QuestionShort;

    dataShort = {question: this.question.question, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory };
  
  this.api.editQuestion(this.urlEdit, dataShort, this.editId).subscribe(data => {console.log(data);this.data = data;this.dataDisplay = data;
    
    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie")
    for(let u1 = 0; u1 < data.length; u1++){
      for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
      this.dataSetCat.add(data[u1].questionCategories[u2].category);
    }
  }
        this.dataSet =  new Set<String>();
        this.dataSet.add("Alle Fragen");
        for(let u = 0; u < data.length; u++){
          this.dataSet.add(data[u].formType);
        }
        console.log(this.dataSet);

  },err => {console.log(err);});

  this.editOn = false;
  this.deleteOn = false;

  location.reload();
  
}
**/

deleteQuestion(): void{

this.deleteIdQuestion = this.question.id;
this.urlDelete = 'http://localhost:8090/frage/' + this.deleteIdQuestion + '/delete';

this.api.deleteQuestion(this.urlDelete, this.deleteIdQuestion).subscribe(data => {console.log(data);this.data = data; this.dataDisplay = data;

  this.dataSetCat = new Set<String>();
  this.dataSetCat.add("keine Kategorie")
  for(let u1 = 0; u1 < data.length; u1++){
    for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
    this.dataSetCat.add(data[u1].questionCategories[u2].category);
  }
}

        this.dataSet =  new Set<String>();
        this.dataSet.add("Alle Fragen");
        for(let u = 0; u < data.length; u++){
          this.dataSet.add(data[u].formType);
        }
        console.log(this.dataSet);

},err => {console.log(err);});

this.deleteIdQuestion = -1;
this.deleteOn = false;
this.editOn = false;

location.reload();

}



addInput(){

    let ch: Choices = {id: 0, choice: "", nextQuestionId: null, questionType: null};

    this.antOpAnzahl += 1;
   // this.fakeArray = new Array(this.antOpAnzahl); 
    this.fakeChoiceArray = new Array(this.antOpAnzahl);

    ch.questionType = this.qtArray;

    if(this.choiceArray.length > 0){
      ch.id = this.choiceArray[this.choiceArray.length - 1].id + 1;
    }else{
      ch.id = 0;
      //this.choiceArray[this.choiceArray.length - 1].id = 0;
    }
      
    this.choiceArray.push(ch);
    console.log(this.choiceArray);
  }


// Methoden zur Anpassung der Choice- und Kategorie-Arrays 
deleteInput(){

    if(this.antOpAnzahl > 0){
      this.antOpAnzahl -= 1;
      this.fakeChoiceArray = new Array(this.antOpAnzahl); 
      this.choiceArray.pop();
  }
}


addInputCat(){

    let cat: QuestionCategory = {id: 0, category: "", processNumber: 0};
    this.catOpAnzahl += 1;
    this.fakeCategoryArray = new Array(this.catOpAnzahl);
    //cat.category = this.qtArray;

    if(this.categoryArray.length > 0){
      
      cat.id = this.categoryArray[this.categoryArray.length - 1].id + 1;
    }else{
      cat.id = 0;
 
    }
      
    this.categoryArray.push(cat);
    console.log(this.categoryArray);
    console.log(this.fakeCategoryArray.length);
  }


  deleteInputCat(){

    if(this.catOpAnzahl > 0){
      this.catOpAnzahl -= 1;
      this.fakeCategoryArray = new Array(this.catOpAnzahl); 
      this.categoryArray.pop();
    }
  }

}

//--------------------------------------------------------------------------------------------------------------------------------

interface QuestionType{

  id:number,
  type:string,
  nextQuestionId:number,
  choices:Array<Choices>

}

interface QuestionCategory{

  id:number,
  category:string,
  processNumber:number

}


interface Choices{

  id:number,
  choice:string,
  nextQuestionId:number,
  questionType:Array<QuestionType>

}


interface Question{

  id:number,
  question:string,
  questionType:QuestionType,
  hint:string,
  formType:string,
  questionCategory:Array<QuestionCategory>

}


//--------------------------------------------------------------------------------------------------------------------------


interface QuestionTypeShort{

  type:string,
  choices:Array<ChoicesShort>
  
  }
  
  
interface QuestionCategoryShort{
  

  category:string,
  processNumber:number
  
  }
  
  
interface ChoicesShort{
  
  choice:string,
  
  }
  
  
interface QuestionShort{
  
  question:string,
  questionType:QuestionTypeShort,
  hint:string,
  formType:string,
  questionCategories:Array<QuestionCategoryShort>,
  
  }




//-------------------------------------------------------------------------------------------------------------------------------
// Only for Inserting NextQuestionId

interface QuestionTypeShortNext{

  type:string,
  nextQuestionId:number,
  choices:Array<ChoicesShortNext>
  
}
  
  
interface QuestionCategoryShortNext{
  
  category:string,
  processNumber:number
  
}
  
  
interface ChoicesShortNext{

  choice:string,
  nextQuestionId:number
  
}
  
  
interface QuestionShortNext{
  
  question:string,
  questionType:QuestionTypeShortNext,
  hint:string,
  formType:string,
  questionCategories:Array<QuestionCategoryShortNext>,
  
}
  //---------------------------------------------------------------------------------------------------------------------------


interface Kategorien{
   
  id:number,
  name:string

}
