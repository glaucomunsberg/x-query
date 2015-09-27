Polymer({
  is: "x-query",
  properties:{
    /**
     * Identifier of x-query.
     */
    id:{
      type: String,
      value: "0"
    },
    mysql:{
      type: Boolean,
      value:false
    },
    /**
     * permit to check if the interface field were completed.
     */
    _readyToQuery:{
      type:Boolean,
      value: false
    },
    /**
     * Array with the operatos permited on x-query
     *  Operator ['logic_operation','label','is_used_to_numbers']
     */
    _operators:{
      type: Array,
      value: function(){
        return [
          ['or','ou',true],['and','e',true],['order','ordenar',true],['limit','limitar',true],['least','Ao menos',false],['until','até',true],['and_parenteses_left','e (',true],['or_parenteses_left','ou (',true], ['parenteses_right',')',true]
        ];
      }
    },
    /**
     * Array with the properties permited on x-query
     *  Property ['label',<Type>,'field',[Values],<Ordernable>]
     *
     *  Type        : permited only 'array' | 'number' | 'string']
     *  Values      : is an Array   [['id','value_1'],['id','value_2']]
     *  Ordernable  : permited only true | false
     *
     *  Atention
     *      Number and String types the Value needs be []
     */
    _properties:{
      type: Array,
      value: function(){
        return [
          //["Escolaridade","array","graduacao",[[0,'Mestrado'],[1,'Graduação'],[2,'Doutorado'],[3,'Pós-Doutorado']],true],
          //["Universidade","array","universidade",[[0,'UFPel'],[1,'UFRG'],[2,'UFRGS'],[3,'UFSM']],true],
          //["Nome","string",'nome',[],false],
          //["Sobrenome","string",'sobrenome',[],false],
          //["Publições","number",'publicoes',[],false],
          //["Artigos","number",'artigos',[],false],
          //["Patentes","number",'patentes',[],false],
          //["Idade",'number','age',[],false]
        ];
      }
    },
    /**
     * property used to check parenteses use on x-query
     */
    _isParenteseUsed:{
      type:Boolean,
      value: false
    }
  },
  /**
   * Call after load all components
   */
  ready: function(){
    //console.log('x-query',this.getNextID());
    this.$.query_ui.addEventListener("click",this.checkQuery);
    this.$.query_ui.addEventListener("click",this.checkQuery);
    this.$.base.querySelector("paper-icon-button[icon='add-circle'] iron-icon").style.width = '35px';
    this.$.base.querySelector("paper-icon-button[icon='add-circle'] iron-icon").style.height = '35px';

  },
  /**
   * Method that create line at line on interface
   */
  newLine: function(){
    //console.log('newLine');
    var id = this._getNextID();
    if(this.$.query_ui.querySelectorAll('div').length == 0){
      $(this.$.query_ui).append("<div id='"+id+"' class='style-scope x-query horizonal layout start'><div corner class='flex style-scope x-query' ></div>"+this._generateProperts(id)+"<paper-icon-button class='one style-scope x-query' icon='cancel'></paper-icon-button></div>")
      this.$.query_ui.querySelector("div[id='"+id+"'] paper-dropdown-menu[properties]").addEventListener("click",this._propertClicked);
    }else{
      $(this.$.query_ui).append("<div id='"+id+"' line_operator class='style-scope x-query horizonal layout start'>"+this._generateOperators(id)+"<paper-icon-button class='one style-scope x-query' icon='cancel'></paper-icon-button></div>")

      if(this._isParenteseUsed){
        this.$.query_ui.querySelector("div[id='"+id+"']").style.paddingLeft = '45px';
      }

      this.$.query_ui.querySelector("div[id='"+id+"'] paper-dropdown-menu[operators]").addEventListener("click",this._operatorClicked);
    }
    this.$.query_ui.querySelector("div[id='"+id+"'] paper-icon-button[icon='cancel']").addEventListener("click",this._cancel);
    this.checkQuery();
    this._checkDropdownMenus();
  },
  /**
   * Method used by user to get all Properties
   */
  listProperties: function(){
    return this._properties;
  },
  /**
   * Method used by user to get all Operations
   */
  listOperators: function(){
    return this._operators;
  },
  /**
   * Remove one of propertys used at x-query
   * Parm: The field name
   */
  removeProperty:function(property_field){
    deleted = false;
    for(var a=0; a < this._properties.length;a++){
      if(this._properties[a][2] == property_field){
        this._properties.splice(a,1);
        deleted = !deleted;
      }
    }
    //console.log('deleted',deleted);
  },
  /**
   * Method to insert a new property
   * parm: label, typed, field,values and isToNumber (check _properties constructor types)
   */
  addProperty: function(label,typed,field,values,isToNumber){
    isOk = false;
    switch (typed) {
      case 'number':
      case 'array':
      case 'string':
        isOk = true;
        break;
      default:
        console.log('x-query','type is not string with number, array or string')
    }
    if(values.constructor !== Array ){
      console.log('x-query','values is not type of Array');
      isOk = false;
    }
    if(isToNumber.constructor !== Boolean){
      console.log('x-query','isToNumber is not type of Boolean');
      isOk = false;
    }
    if(isOk){
      this._properties.push([label,typed,field,values,isToNumber]);
    }
  },
  /**
   * Called when needs create a new operator on interface
   */
  _generateOperators: function(id){
    //console.log('_generateOperators')
    operators = this._operators;
    string = "<paper-dropdown-menu operators class='x-query' label='Operador' no-label-float><paper-menu class='dropdown-content'>";
    for(var a=0;a < operators.length;a++){
      if(operators[a][2]){
        if(this._isParenteseUsed){
          if(operators[a][0] != 'or_parenteses_left' && operators[a][0] != 'and_parenteses_left' ){
            string+="<paper-item value='"+operators[a][0]+"'>"+operators[a][1]+"</paper-item>"
          }
        }else{
          string+="<paper-item value='"+operators[a][0]+"'>"+operators[a][1]+"</paper-item>"
        }

      }

    }
    return string += "</paper-menu></paper-dropdown-menu>";
  },
  /**
   * Callend to create all properties on interface
   */
  _generateProperts: function(){
    //console.log('_generateProperts');
    properties = this._properties;
    string  = "<paper-dropdown-menu properties class='x-query' label='propriedade'><paper-menu class='dropdown-content'>";
    for(var a=0;a<properties.length;a++){
      string += "<paper-item value='"+properties[a][2]+"'>"+properties[a][0]+"</paper-item>"
    }
    string += "</paper-menu></paper-dropdown-menu>";
    return string
  },
  /**
   * Differnt of _generateProperts this method use only
   *  the properties that can be used to order
   */
  _generatePropertsToOrder: function(){
    //console.log('_generatePropertsToOrder');
    properties = this._properties;
    string  = "<paper-dropdown-menu properties class='x-query' label='propriedade'><paper-menu class='dropdown-content'>";
    for(var a=0;a<properties.length;a++){
      if(properties[a][4]){
        string += "<paper-item value='"+properties[a][2]+"'>"+properties[a][0]+"</paper-item>"
      }
    }
    string += "</paper-menu></paper-dropdown-menu>";
    return string
  },
  /**
   * Function on Click at one Operator
   */
  _operatorClicked:function(e){
    //console.log('_operatorClicked',this.parentNode);
    property_id = e.target.getAttribute('value');

    if(property_id != "" && property_id != null){

      paper_dropdown = this;
      x_query = this.parentNode.parentNode.parentNode;
      operators = this.parentNode.parentNode.parentNode._operators;
      properties = this.parentNode.parentNode.parentNode._properties;
      parent = paper_dropdown.parentNode;
      icon_remove = parent.querySelector('paper-icon-button');

      element = parent.querySelector('paper-dropdown-menu[properties]');
      if(element != null){
        parent.removeChild(element)
      }
      element = parent.querySelector('paper-dropdown-menu[filters]');
      if(element != null){
        parent.removeChild(element)
      }
      element = parent.querySelector('paper-input[values]');
      if(element != null){
        parent.removeChild(element)
      }
      element = parent.querySelector('paper-dropdown-menu[values]');
      if(element != null){
        parent.removeChild(element)
      }
      parent.removeChild(icon_remove);

      for(var a=0;a<operators.length;a++){
        if(property_id == operators[a][0]){
          switch (property_id) {
            case 'or':
            case 'and':
                string = x_query._generateProperts();
                $(parent).append(string);
                parent.querySelector("paper-dropdown-menu[properties]").addEventListener("click",x_query._propertClicked);
                //console.log('or or and')
                break;
            case 'limit':
                  string = "<paper-input values class='x-query' type='number' label='valor'></paper-input>";
                  $(parent).append(string);
                  parent.querySelector("paper-input[values]").addEventListener("change",x_query._valueChange);
                  //console.log('limit')
                  break;
            case 'order':
                  string = x_query._generatePropertsToOrder();
                  $(parent).append(string);
                  string = "<paper-dropdown-menu filters label='filtro' class='x-query'><paper-menu class='dropdown-content'>";
                  string += "<paper-item value='ASC'>ASC</paper-item>";
                  string += "<paper-item value='desc'>DESC</paper-item>";
                  string += "</paper-menu></paper-dropdown-menu>";
                  $(parent).append(string);
                  parent.querySelector("paper-dropdown-menu[filters]").addEventListener("click",x_query._valueChange);
                  //console.log('order')
                  break;
              case 'and_parenteses_left':
              case 'or_parenteses_left':
                  x_query._isParenteseUsed = true;
                  string = x_query._generateProperts();
                  $(parent).append(string);
                  parent.querySelector("paper-dropdown-menu[properties]").addEventListener("click",x_query._propertClicked);
                  break;
              case 'parenteses_right':
                  //console.log('parenteses_right');
                  x_query._isParenteseUsed = false;
                  this.parentNode.style.paddingLeft = '0px';
                  break;
            default:

          }
          $(parent).append(icon_remove);
          x_query._checkDropdownMenus();
        }
      }
    }
  },

  /**
   * Function on Click at one Filter
   */
  _filtersClicked: function(e){
    //console.log('_filtersClicked')
    var x_query = 'nada';
    el = this;
    tagName = "x-query";

    while (el && el.parentNode) {
      el = el.parentNode;
      if (el.tagName && el.tagName.toLowerCase() == tagName) {
        x_query = el;
      }
    }

    x_query.checkQuery();
  },

  /**
   * Function on Click on one Property
   */
  _propertClicked:function(e){
    //console.log('_propertClicked',e.target)
    property_id = e.target.getAttribute('value');

    if(property_id != "" && property_id != null){

      paper_dropdown = this;
      x_query = this.parentNode.parentNode.parentNode;
      properties = this.parentNode.parentNode.parentNode._properties;
      parent = paper_dropdown.parentNode;
      icon_remove = parent.querySelector('paper-icon-button');
      parent.removeChild(icon_remove);

      for(var a=0;a<properties.length;a++){
        if(property_id == properties[a][2]){

          element = parent.querySelector('paper-dropdown-menu[filters]');
          if(element != null && element != ""){
            parent.removeChild(element)
          }
          element = parent.querySelector('paper-input[values]');
          if(element != null && element != ""){
            parent.removeChild(element)
          }
          element = parent.querySelector('paper-dropdown-menu[values]');
          if(element != null && element != ""){
            parent.removeChild(element)
          }
          //console.log(properties[a][1])
          switch (properties[a][1]) {
            case 'array':
              string = "<paper-dropdown-menu filters label='filtro' class='x-query'><paper-menu class='dropdown-content'>";
              string += "<paper-item value='equal'>Igual</paper-item>";
              string += "<paper-item value='different'>Diferente</paper-item>";
              string += "</paper-menu></paper-dropdown-menu>";
              $(parent).append(string);
              string = "<paper-dropdown-menu values label='valor' class='x-query'><paper-menu class='dropdown-content'>";
              for(var b=0;b < properties[a][3].length;b++){
                string += "<paper-item value='"+properties[a][3][b][0]+"'>"+properties[a][3][b][1]+"</paper-item>";
              }
              string += "</paper-menu></paper-dropdown-menu>";
              $(parent).append(string);
              parent.querySelector("paper-dropdown-menu[filters]").addEventListener("click",x_query._filtersClicked);
              parent.querySelector("paper-dropdown-menu[values]").addEventListener("change",x_query._valueChange);
              x_query._checkDropdownMenus();
              break;
            case 'number':

                string = "<paper-dropdown-menu filters label='filtro' class='x-query'><paper-menu class='dropdown-content'>";
                string += "<paper-item value='less'>Menor</paper-item>";
                string += "<paper-item value='until'>Até</paper-item>";
                string += "<paper-item value='equal'>Igual</paper-item>";
                string += "<paper-item value='least'>Ao Menos</paper-item>";
                string += "<paper-item value='bigger'>Maior</paper-item>";
                string += "<paper-item value='different'>Diferente</paper-item>";
                string += "</paper-menu></paper-dropdown-menu>";
                $(parent).append(string);
                string = "<paper-input values class='x-query' type='number' label='valor'></paper-input>";
                $(parent).append(string);
                parent.querySelector("paper-dropdown-menu[filters]").addEventListener("click",x_query._filtersClicked);
                parent.querySelector("paper-input[values]").addEventListener("change",x_query._valueChange);
                x_query._checkDropdownMenus();
                break;
            case 'string':
                string = "<paper-dropdown-menu filters label='filtro' class='x-query'><paper-menu class='dropdown-content'>";
                string += "<paper-item value='contains'>Contém</paper-item>";
                string += "<paper-item value='equal'>Igual</paper-item>";
                string += "<paper-item value='different'>Diferente</paper-item>";
                string += "</paper-menu></paper-dropdown-menu>";
                $(parent).append(string);
                string = "<paper-input values  class='x-query' type='text' label='valor'></paper-input>";
                $(parent).append(string);
                parent.querySelector("paper-dropdown-menu[filters]").addEventListener("click",x_query._filtersClicked);
                parent.querySelector("paper-input[values]").addEventListener("change",x_query._valueChange);
                x_query._checkDropdownMenus();
                break;
          }
          //console.log('cccc',a,properties[a][1],property_id)
          $(parent).append(icon_remove);

        }
      }
      x_query.checkQuery();
    }
  },
  /**
   * When any value change this method will call to
   *  check interface build lines
   */
  _valueChange: function(e){
    //console.log('_valueChange')
    var x_query = 'nada';
    el = this;
    tagName = "x-query".toLowerCase();

    while (el && el.parentNode) {
      el = el.parentNode;
      if (el.tagName && el.tagName.toLowerCase() == tagName) {
        x_query = el;
      }
    }
    x_query.checkQuery();

  },
  /**
   * Method that check if the lines are builded right then
   *  pint the border-lines with red or the primary color
   */
  checkQuery:function(){
    //console.log('checkQuery');
    lines = this.$.query_ui;
    linesOk = [];
    if(lines.childElementCount == 0){
      this.$.base.querySelector("div[line]").style.background = '#00ad99';
    }
    for(var a=0;a < lines.childElementCount;a++){
      lineIsNotComplet = false;
      line = lines.children[a];
      menus = line.querySelectorAll('paper-dropdown-menu');
      for(var b=0;b < menus.length;b++){
        menu = menus[b];
        if(menu.selectedItem == "" || menu.selectedItem == null){
          lineIsNotComplet = true;
        }

      }
      inputs = line.querySelectorAll('paper-input');
      for(var b=0;b < inputs.length;b++){
        input = inputs[b]
        if(input.value == "" || input.value == null){
          lineIsNotComplet = true;
        }
      }
      if(lineIsNotComplet){

        //console.log('Checked','Erro!');
        if(a == 0){
          line.querySelector('div[corner]').style.borderTopColor = '#f04b57';
          line.querySelector('div[corner]').style.borderLeftColor = '#f04b57';
        }
        for(var b=0;b < menus.length;b++){
          menus[b].getElementsByClassName("unfocused-line")[0].style.background ='#f04b57';;
        }
        for(var b=0;b < inputs.length;b++){
          inputs[b].getElementsByClassName("unfocused-line")[0].style.background ='#f04b57';
        }
        if(a != 0){
          line.style.borderLeftColor = '#f04b57';
        }


      }else{
        linesOk.push(a)
        menus = line.querySelectorAll('paper-dropdown-menu');
        inputs = line.querySelectorAll('paper-input');
        if(a == 0){
          line.querySelector('div[corner]').style.borderTopColor = '#00ad99';
          line.querySelector('div[corner]').style.borderLeftColor = '#00ad99';
        }
        for(var b=0;b < menus.length;b++){
          menus[b].getElementsByClassName("unfocused-line")[0].style.background ='#00ad99';;
        }
        for(var b=0;b < inputs.length;b++){
          inputs[b].getElementsByClassName("unfocused-line")[0].style.background ='#00ad99';
        }
        if(a != 0){
          line.style.borderLeftColor = '#00ad99';
        }
      }
    }

    if(linesOk.length == 0){
      this.$.base.querySelector("div[line]").style.background = '#f04b57';
      this._readyToQuery = false;
    }else{
      this.$.base.querySelector("div[line]").style.background = '#00ad99';
      if(linesOk.length == lines.childElementCount){

        this._readyToQuery = true;
        this.fire('x-query-ready');
        //console.log('IS OK')
      }else{
        this._readyToQuery = false;
      }
    }
  },
  /**
   * Function that enable the dropdowns menu
   *  ALERT: Polymer error
   */
  _checkDropdownMenus: function(e){
    //console.log('_checkDropdownMenus');
    paper_dropdowns = this.$.query_ui.querySelectorAll('paper-dropdown-menu');
     for(var a=0; a < paper_dropdowns.length;a++){
       paper_dropdowns[a].disabled = false;
       paper_dropdowns[a].querySelector('paper-input').disabled = false;
       paper_dropdowns[a].querySelector('paper-menu-button').disabled = false;
       paper_dropdowns[a].querySelector('iron-dropdown').disabled = false;
     }
  },
  /**
   * Method used to create the query array based on interface lines
   */
  mountQuery:function(){
    //console.log('mountQuery');
    query = []
    if(this._readyToQuery){
      lines = this.$.query_ui;
      for(var a=0;a < lines.childElementCount;a++){
        line = lines.children[a];
        query_line = []
        operator = line.querySelector('paper-dropdown-menu[operators]');
        if(operator != null){
          operator.selectedItem.getAttribute('value');
          query_line = []
          query_line.push(operator.selectedItem.getAttribute('value'));
          switch(operator.selectedItem.getAttribute('value')){
            case 'or_parenteses_left':
            case 'and_parenteses_left':
            case 'or':
            case 'and':
              query_line.push(line.querySelector('paper-dropdown-menu[properties]').selectedItem.getAttribute('value'));
              query_line.push(line.querySelector('paper-dropdown-menu[filters]').selectedItem.getAttribute('value'));
              if(line.querySelector('paper-dropdown-menu[values]') != null && line.querySelector('paper-dropdown-menu[values]') != ""){
                query_line.push(line.querySelector('paper-dropdown-menu[values]').selectedItem.getAttribute('value'));
              }else{
                query_line.push(line.querySelector('paper-input[values]').value);
              }
              break;
            case 'limit':
              query_line.push(line.querySelector('paper-input[values]').value);
              break;
            case 'order':
              query_line.push(line.querySelector('paper-dropdown-menu[properties]').selectedItem.getAttribute('value'));
              query_line.push(line.querySelector('paper-dropdown-menu[filters]').selectedItem.getAttribute('value'));
              break;
          }
          query.push(query_line)
        }else{

          query_line.push("");
          query_line.push(line.querySelector('paper-dropdown-menu[properties]').selectedItem.getAttribute('value'));
          query_line.push(line.querySelector('paper-dropdown-menu[filters]').selectedItem.getAttribute('value'));
          if(line.querySelector('paper-dropdown-menu[values]') != null && line.querySelector('paper-dropdown-menu[values]') != ""){
            query_line.push(line.querySelector('paper-dropdown-menu[values]').selectedItem.getAttribute('value'));
          }else{
            query_line.push(line.querySelector('paper-input[values]').value);
          }
          query.push(query_line);
        }

      }

      if(this.mysql){
        return this._getMySQL(query);
      }

      return query;
    }else{
      return [];
    }
  },
  /**
   * Method that send a mysql query
   */
  _getMySQL: function(query){
    var query_mysql = "";
    for(var a=0;a < query.length;a++){
      switch (query[a][0]) {
        case '':
          query_mysql += query[a][1]+" ";
          break;
        case 'and_parenteses_left':
            query_mysql+= 'and ('+query[a][1]+" ";
            break;
        case 'or_parenteses_left':
            query_mysql+= 'or ('+query[a][1]+" ";
            break;
        case 'parenteses_right':
            query_mysql+= ')';
            break;
        case 'and':
          query_mysql +=  'and '+query[a][1]+" ";
          break;
        case 'or':
          query_mysql +=  'or '+query[a][1]+" ";
          break;
        default:

      }
      type = '';
      for(var b=0;b < this._properties.length;b++){
        if(query[a][1] == this._properties[b][2]){
          //console.log('type: ',this._properties[b][1])
          type = this._properties[b][1]
        }
      }
      query_mysql += this._mysqlOperators(type,query[a][2],query[a][3])+"\n";
    }
    for(var a=0;a < query.length;a++){
      switch (query[a][0]) {
        case 'limit':
          query_mysql += "limit "+query[a][1]+"\n";
          break;
        case 'order':
          query_mysql += "order by "+query[a][1]+" "+query[a][2]+"\n";
          break;
        default:
      }
    }
    console.log('MYSQL',query_mysql);
  },
  _mysqlOperators: function(type,operator,next){
    switch (operator) {
      case 'different':
          return " != "+next
          break;
      case 'equal':
          if(type == 'string'){
            return " like \'"+next+"\'";
          }else{
            return " = "+next;
          }
          break;
      case 'contains':
          return " like \'%"+next+"%\'"
          break;
      case 'less':
          return " < "+next
          break;
      case 'until':
          return " <= "+next
          break;
      case 'least':
          return " >= "+next
          break;
      case 'bigger':
          return " > "+next
          break;
      case 'bigger':
          return " > "+next
          break;
      default:

          //console.log("\'\' operator=",query[a][2]);
          return ""
    }
  },
  /**
   * Method used to remove one of interfaces lines
   */
 _cancel: function(){
    //console.log('cancel');
    x_query = this.parentNode.parentNode.parentNode;
    toRemove = this.parentNode
    this.parentNode.parentNode.removeChild(toRemove);
    x_query.checkQuery();
  },
  /**
   * A method that create a individual Identifier
   *  to each line on interface
   */
  _getNextID: function(){
    //console.log('getNextID');
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
});
