function loadGroup()
{
  var hugeStorage = new HugeStorageSync();
  hugeStorage.get("lg", function(string_totale){
    chrome.storage.sync.get(["nom_actif"], function(items){
      if(items["nom_actif"])
      {
	activeGroup.name = items["nom_actif"];
	$("#group_id_" + activeGroup.id.toString()).find(".group_name").val(activeGroup.name);
      }
      else
      {
	console.log("Premier lancement...");
      }

      if(string_totale != "")
      {
	var listLoadGroup = JSON.parse(string_totale);;

	for(var i=0 ; i < listLoadGroup.length; ++i)
	{
	  var newGroup = createGroup();
	  newGroup.name = listLoadGroup[i].name;
	  $("#group_id_" + newGroup.id.toString()).find(".group_name").val(newGroup.name);

	  for(var j=0 ; j < listLoadGroup[i].list_tabs.length; ++j)
	  {
	    // Creation de l'onglet
	    var nouvel_onglet = new classTab();

	    nouvel_onglet.id = getNewIdForTab();
	    nouvel_onglet.id_chrome = -1;
	    nouvel_onglet.url = listLoadGroup[i].list_tabs[j].url;
	    nouvel_onglet.title = listLoadGroup[i].list_tabs[j].title;
            nouvel_onglet.pinned = listLoadGroup[i].list_tabs[j].pinned;
	    nouvel_onglet.icon = listLoadGroup[i].list_tabs[j].icon;
	    nouvel_onglet.tab_group = -1;

	    // Ajout de l'onglet (sans ouvrir l'onglet)
	    addTabToGroup(newGroup, nouvel_onglet);
	  }
	}
      }
      else
      {
	console.log("Non trouve");
      }
    });
  });
}

function saveGroup(callback)
{
  //chrome.storage.sync.clear(function() {
    // Apres avoir videe l'espace de stockage
    var listSaveGroup = new Array();
    for(var i=0 ; i < list_groups.length; ++i)
    {
      // On les copies tous sauf l'actif
      if(list_groups[i].id != activeGroup.id)
      {
	listSaveGroup.push(list_groups[i]);
      }
    }
    // Exportation du nom actif
    chrome.storage.sync.set({"nom_actif": activeGroup.name});

    // On decoupe la liste a sauvegarder en parties
    var hugeStorage = new HugeStorageSync();
    hugeStorage.set('lg', JSON.stringify(listSaveGroup), callback);
    //chrome.storage.sync.set({"list_groups":storageSplit});
  //});
}