class CalcController{

    constructor(){
        this._operation = [];
        this._locale = 'pt-BR';
       //Selecionando elementos do DOM pela tag CSS
       this._displayCalcEl =  document.querySelector('#display');
       this._dateEl = document.querySelector('#data');
       this._timeEl =  document.querySelector('#hora');
        
        //O underline diz que o atributo é privado
        this._currentDate;
        this.initialize();
        this.initButtonEvents();

    }

    initialize(){

        this.setDisplayDateTime();
        //Nessa função estou formatando a data e a hora para o padrão brasileiro e rodando a função novamente a cada 1 segundo
        //atualizando os valores dos mesmos
        let interval = setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);
        /*Função usada para fazer determinado evento depois de um intervalo de tempo
        setTimeout(()=>{
            clearInterval(interval);
        }, 10000);*/
    }
    //Pegando o Ultimo elemento do array
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    isOperator(value){
        console.log("o valor ", value);
       if(value !== '+' && value !== '-'&& value !== '*'&& value !== '/'&& value !== '%'){
           return false;
       }else{
           return true;
       }
        /* Tentei usar essa função mas não conseguir! Revisar sintaxe!       
           if(['+', '-', '*', '/', '%'].indexOf(value) > -1);
          */ 
    }

    setValueOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    addOperation(value){
        
        console.log('Aqui', value, isNaN(this.getLastOperation()));
        
        if(isNaN(this.getLastOperation())){
            //STRING
            if(this.isOperator(value)){
                //Trocar Operador
                this.setValueOperation(value);
            }else if (isNaN(value)){
                //Entrera aqui caso venha undefined por estar sendo iniciado pela primeira vez
                console.log(value);
            }else{
                //iniciando o vetor com o primeiro numero
                this._operation.push(value);   
                console.log("ainda n"); 
            }
        }else{
            if(this.isOperator(value)){
                console.log("entrei aqui");
                this._operation.push(value);
            }else{
                console.log('passei direto');
                //NUMBER
                //Transformando os valores em string para concatenar
                var newValue = this.getLastOperation().toString() + value.toString();
                //adicionando um elemendo ao array
                this.setValueOperation(parseInt(newValue));
            }
        }
        console.log('B',this._operation);
    }

    setError(){
        this.displayCalc = "Sync Error";
    }

    clearAll(){
        this._operation = [];
    }
    //Eliminando o ultimo elemento do array
    clearEntry(){
        this._operation.pop();
    }

    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
               
                break; 
            case 'ponto':
                this.addOperation('.');
                break;    
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;           
            default:
                this.setError();                   
        }
    }


    initButtonEvents(){
        //Pegando os butões existentes na calculadora (DOM)
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        //Criando evento Click para todos os botões encontrados com o querySelector
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn,'click drag'  , e=> {
                let textBtn = btn.className.baseVal.replace('btn-','');
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, 'mouseup mouseover mousedown', e=>{
                btn.style.cursor = 'pointer';
            });
        });
    }
    //Percorrendo os eventos e adicionando um de cada vez ao botão
    addEventListenerAll(element, events, fn){
       //Split transforma a string em um array
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day :"2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
    
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }
    
    set currentDate(value){
        this._currentDate = value;
    }
    
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }
    
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }
    
    get displayTime(){
        return this._timeEl.innerHTML;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    get currentDate(){
        return new Date();
    }
}