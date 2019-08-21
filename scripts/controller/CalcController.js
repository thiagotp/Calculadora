class CalcController{

    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
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
        this.initKeyboard();

    }

    pasteFromClipboard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
            
        });

    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

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
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();
        document.querySelectorAll('.btn-ac').forEach(btn=>{

            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });

        });
    }

    //Mudando os status da variável audioOnOff para ligar o som da calculadora
    toggleAudio(){
        
        this._audioOnOff = (this._audioOnOff) ? false : true;


    }

    //Adicionando som na calculadora
    playAudio(){
        if(this._audioOnOff){
            //forçando o áudio a voltar para o inicio quando apertar outro botão
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }
    //Pegando o Ultimo elemento do array
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    isOperator(value){

       if(value === '+' || value === '-'|| value === '*' || value === '/' || value === '%'){
           return true;
       }else{
           return false;
       }
        /* Tentei usar essa função mas não conseguir! Revisar sintaxe!       
           if(['+', '-', '*', '/', '%'].indexOf(value) > -1);
          */ 
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    pushOperation(value){
        this._operation.push(value);
        //Condição para verificar quando o quarto elemento do array foi inserido
        if(this._operation.length > 3){
            //função que irá realizar o cálculo dos elementos 3 primeiros elementos do array
            this.calc();
        }
    }

    getResult(){
        
        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
            }, 1);
        }    

    }

    calc(){

        let last = '';
        
        this._lastOperator = this.getLastItem(true);

        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length >3){
        //Guardando e retirando o quarto elemento do array
            console.log("estou no if");
            last = this._operation.pop();
            this._lastNumber = this.getResult();  
            
        }else if  (this._operation.length == 3){
            console.log("entrei no else if");
            this._lastNumber = this.getLastItem(false);
        }
        console.log('Ultimo Numero',this._lastNumber);
        console.log('Ultimo Operador', this._lastOperator);
        //Transformando o array em uma string para que possa ser calculado pelo eval
        let result = this.getResult();

        if(last == "%"){
            result /= 100;

            this._operation = [result];
        }else{
            //Estabelecendo uma nova configuração de array onde o resultado é o primeiro elemento e o last o segundo
            this._operation = [result];
            //se last for
            if(last) this._operation.push(last);
        }
        
        //atualizando o display com o resultado
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator){
        let lastItem;
            //pegando o ultimo item do array. Pode ser número ou sinal
            for(let i=this._operation.length-1; i>=0; i--){
                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    
                    break;
                }
            }
        
        if(!lastItem){

            //Mantendo o último operador
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
      
        let lastItem = this.getLastItem(false);
        
        if(!lastItem) lastItem = 0;      

        this.displayCalc = lastItem;
    }
    //Trabalhando com o ponto
    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString()+'.');
        }
        this.setLastNumberToDisplay();
    }

    initKeyboard(){

        document.addEventListener('keyup', e=>{
            
            this.playAudio();
            console.log(this._audioOnOff);
            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break; 
                case '.':
                case ',':
                    this.addDot();
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
                    this.addOperation(parseInt(e.key));
                    break;                 
            }

        });
    }

    addOperation(value){
        
        console.log('Aqui', value, isNaN(this.getLastOperation()));
        //IsNaN verifica se não é um número
        if(isNaN(this.getLastOperation())){
            //STRING
            if(this.isOperator(value)){
                //Trocar Operador
                this.setLastOperation(value);
            } else {
                //iniciando o vetor com o primeiro numero
                this.pushOperation(value);  
                //atualizar display
                this.setLastNumberToDisplay(); 
                
            }
        }else{
            if(this.isOperator(value)){
                
                this.pushOperation(value);
            }else{
                
                //NUMBER
                //Transformando os valores em string para concatenar
                var newValue = this.getLastOperation().toString() + value.toString();
                //adicionando um elemendo ao array
                this.setLastOperation(newValue);

                //atualizar display
                this.setLastNumberToDisplay();
            }
        }
        console.log('B',this._operation);
    }

    setError(){
        this.displayCalc = "Sync Error";
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }
    //Eliminando o ultimo elemento do array
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    execBtn(value){

        this.playAudio();
        console.log(this._audioOnOff);
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
                this.calc();
                break; 
            case 'ponto':
                this.addDot();
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
        if(value.toString().length > 10){
            this.setError();
            return false;
        }
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