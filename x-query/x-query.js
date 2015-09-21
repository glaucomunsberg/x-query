Polymer({
  is: "x-query",
  properties:{
    /**
     * Identifier of person.
     */
    id:{
      type: String,
      value: "0"
    },
    _readyToQuery:{
      type:Boolean,
      value: false
    },
    _operators:{
      type: Array,
      value: function(){
        return [['or','ou',true],['and','e',true],['order','ordenar',true],['limit','limitar',true],['least','Ao menos',false],['until','até',false]];
      }
    },
    _properties:{
      type: Array,
      value: function(){
        return [
          ["Escolaridade","array","graduacao",['Mestrado','Graduação','Doutorado','Pós-Doutorado'],true],
          ["Universidade","array","universidade",['UFPel','UFRG','UFRGS','UFSM'],true],
          ["Nome","string",'nome',[],false],
          ["Sobrenome","string",'sobrenome',[],false],
          ["Publições","number",'publicoes',[],false],
          ["Artigos","number",'artigos',[],false],
          ["Patentes","number",'patentes',[],false],
          ["Idade",'number','age',[],false]
        ];
      }
    }
  },
  /**
   * Call after load all components
   */
  ready: function(){
    //console.log('x-query',this.getNextID());
  },
  newLine: function(){
    //console.log('newLine');
    var id = this.getNextID();
    if(this.$.query_ui.querySelectorAll('div').length == 0){
      $(this.$.query_ui).append("<div id='"+id+"' class='style-scope x-query horizonal layout start'><div corner class='flex style-scope x-query' ></div>"+this._generateProperts(id)+"<paper-icon-button class='one style-scope x-query' icon='cancel'></paper-icon-button></div>")
      this.$.query_ui.querySelector("div[id='"+id+"'] paper-dropdown-menu[properties]").addEventListener("click",this._propertClicked);
    }else{
      $(this.$.query_ui).append("<div id='"+id+"' class='style-scope x-query horizonal layout start'>"+this._generateOperators(id)+"<paper-icon-button class='one style-scope x-query' icon='cancel'></paper-icon-button></div>")
      this.$.query_ui.querySelector("div[id='"+id+"'] paper-dropdown-menu[operators]").addEventListener("click",this._operatorClicked);
    }
    this.$.query_ui.querySelector("div[id='"+id+"'] paper-icon-button[icon='cancel']").addEventListener("click",this.cancel);
    this.checkQuery();
    this._checkDropdownMenus();
  },
  _generateOperators: function(id){
    //console.log('_generateOperators')
    operators = this._operators;
    string = "<paper-dropdown-menu operators class='x-query' label='Operador' no-label-float><paper-menu class='dropdown-content'>";
    for(a=0;a < operators.length;a++){
      if(operators[a][2]){
        string+="<paper-item value='"+operators[a][0]+"'>"+operators[a][1]+"</paper-item>"
      }

    }
    return string += "</paper-menu></paper-dropdown-menu>";
  },
  _generateProperts: function(){
    //console.log('_generateProperts');
    properties = this._properties;
    string  = "<paper-dropdown-menu properties class='x-query' label='propriedade'><paper-menu class='dropdown-content'>";
    for(a=0;a<properties.length;a++){
      string += "<paper-item value='"+properties[a][2]+"'>"+properties[a][0]+"</paper-item>"
    }
    string += "</paper-menu></paper-dropdown-menu>";
    return string
  },
  _generatePropertsToOrder: function(){
    //console.log('_generatePropertsToOrder');
    properties = this._properties;
    string  = "<paper-dropdown-menu properties class='x-query' label='propriedade'><paper-menu class='dropdown-content'>";
    for(a=0;a<properties.length;a++){
      if(properties[a][4]){
        string += "<paper-item value='"+properties[a][2]+"'>"+properties[a][0]+"</paper-item>"
      }
    }
    string += "</paper-menu></paper-dropdown-menu>";
    return string
  },
  _operatorClicked:function(e){
    //console.log('_operatorClicked');
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

      //console.log('operator_id',property_id);
      //console.log('paper_dropdown',paper_dropdown);
      //console.log('operators',operators);
      //console.log('parent',parent);

      for(a=0;a<operators.length;a++){
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
            default:

          }
          $(parent).append(icon_remove);
          x_query._checkDropdownMenus();
        }
      }
    }
  },
  _filtersClicked: function(e){
    //console.log('_filtersClicked')
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
              for(b=0;b < properties[a][3].length;b++){
                string += "<paper-item value='"+properties[a][3][b]+"'>"+properties[a][3][b]+"</paper-item>";
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
  checkQuery:function(){
    //console.log('checkQuery');
    lines = this.$.query_ui;
    linesOk = [];
    if(lines.childElementCount == 0){
      this.$.base.querySelector("div[line]").style.background = '#00ad99';
    }
    for(a=0;a < lines.childElementCount;a++){
      lineIsNotComplet = false;
      line = lines.children[a];
      menus = line.querySelectorAll('paper-dropdown-menu');
      for(b=0;b < menus.length;b++){
        menu = menus[b];
        if(menu.selectedItem == "" || menu.selectedItem == null){
          lineIsNotComplet = true;
        }

      }
      inputs = line.querySelectorAll('paper-input');
      for(b=0;b < inputs.length;b++){
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
        for(b=0;b < menus.length;b++){
          menus[b].getElementsByClassName("unfocused-line")[0].style.background ='#f04b57';;
        }
        for(b=0;b < inputs.length;b++){
          inputs[b].getElementsByClassName("unfocused-line")[0].style.background ='#f04b57';
        }

      }else{
        linesOk.push(a)
        menus = line.querySelectorAll('paper-dropdown-menu');
        inputs = line.querySelectorAll('paper-input');
        if(a == 0){
          line.querySelector('div[corner]').style.borderTopColor = '#00ad99';
          line.querySelector('div[corner]').style.borderLeftColor = '#00ad99';
        }
        for(b=0;b < menus.length;b++){
          menus[b].getElementsByClassName("unfocused-line")[0].style.background ='#00ad99';;
        }
        for(b=0;b < inputs.length;b++){
          inputs[b].getElementsByClassName("unfocused-line")[0].style.background ='#00ad99';
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
  _checkDropdownMenus: function(e){
    //console.log('_checkDropdownMenus');
    paper_dropdowns = this.$.query_ui.querySelectorAll('paper-dropdown-menu');
     for(a=0; a < paper_dropdowns.length;a++){
       paper_dropdowns[a].disabled = false;
       paper_dropdowns[a].querySelector('paper-input').disabled = false;
       paper_dropdowns[a].querySelector('paper-menu-button').disabled = false;
       paper_dropdowns[a].querySelector('iron-dropdown').disabled = false;
     }
  },
  mountQuery:function(){
    //console.log('mountQuery');
    query = []
    if(this._readyToQuery){
      lines = this.$.query_ui;
      for(a=0;a < lines.childElementCount;a++){
        line = lines.children[a];
        query_line = []
        operator = line.querySelector('paper-dropdown-menu[operators]');
        if(operator != null){
          operator.selectedItem.getAttribute('value');
          query_line = []
          query_line.push(operator.selectedItem.getAttribute('value'));
          switch(operator.selectedItem.getAttribute('value')){
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
      return query;
    }else{
      return [];
    }
  },
  cancel: function(){
    //console.log('cancel');
    x_query = this.parentNode.parentNode.parentNode;
    toRemove = this.parentNode
    this.parentNode.parentNode.removeChild(toRemove);
    x_query.checkQuery();
  },
  getNextID: function(){
    //console.log('getNextID');
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
});
