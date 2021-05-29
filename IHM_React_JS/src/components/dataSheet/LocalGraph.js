function LocalGraph(j, j_graph, table) {
    const color = ['#B1D3DD', '#B2DA82', '#FFC300', '#FF5733', '#80624D']

    if (table === 'textes_publies') {
        // on choisit d'afficher le texte, son edition, les textes de son édition (textes_voisins), les airs et enfin les textes liés à ces airs (textes_airs_voisins)

        // NODES
        let res_nodes = '{ "nodes" : ['
        let res_links = '"edges" : ['

        // le texte
        let texte = j['data']['textes_publies']
        res_nodes = res_nodes.concat('{ "id" : "textes_publies__' + texte[0]['id'] + '", "label" : "' + texte[0]['titre'] + '", "color" : "' + color[1] + '", "size" : 1 }, ')

        // son édition
        let edition = texte[0]['edition']
        res_nodes = res_nodes.concat('{ "id" : "editions__' + edition['id'] + '", "label" : "' + edition['titre_ouvrage'] + '", "color" : "' + color[4] + '", "size" : 0.7 }, ')

        // autres textes de son édition
        let textes_voisins = '[ '
        for (var i = 0; i < j_graph['data']['textes_publies'].length; i++) {
            if (j_graph['data']['textes_publies'][i]['edition']['id'] === edition['id'] && j_graph['data']['textes_publies'][i]['id']!==texte[0]['id']) {
                textes_voisins = textes_voisins.concat(JSON.stringify(j_graph['data']['textes_publies'][i]))
                textes_voisins = textes_voisins.concat(', ')
            }
        }
        if (textes_voisins !== '[ ') {
            textes_voisins = textes_voisins.substring(0, textes_voisins.length - 2)
            textes_voisins = JSON.parse(textes_voisins + ']')
            for (i = 0; i < textes_voisins.length; i++) {
                res_nodes = res_nodes.concat('{ "id" : "textes_publies__' + textes_voisins[i]['id'] + '", "label" : "' + textes_voisins[i]['titre'] + '", "color" : "' + color[1] + '","size" : 0.4 }, ')
            }
        }

        // les airs
        for (i = 0; i < j['data']['timbres'].length; i++) {
            res_nodes = res_nodes.concat('{ "id" : "airs__' + j['data']['timbres'][i]['airs']['id'] + '", "label" : "' + j['data']['timbres'][i]['airs']['air_normalise'] + '", "color" : "' + color[0] + '","size" : 0.4 }, ')
        }

        // les textes liés à ses airs
        let textes_airs_voisins = '['
        for (var i = 0; i < j_graph['data']['timbres'].length; i++) {
            for (var k = 0; k < j['data']['timbres'].length; k++) {
                if (j_graph['data']['timbres'][i]['airs']['id'] === j['data']['timbres'][k]['airs']['id'] && j_graph['data']['timbres'][i]['textes_publies']['id'] !== texte[0]['id']) {
                    
                    console.log(JSON.stringify(j_graph['data']['timbres'][i]['textes_publies']))
                    textes_airs_voisins = textes_airs_voisins.concat(JSON.stringify(j_graph['data']['timbres'][i]['textes_publies']))
                    textes_airs_voisins = textes_airs_voisins.concat(', ')
                    res_links = res_links.concat('{ "id" : "' + j_graph['data']['timbres'][i]['id'] + '", "source" : "airs__' + j['data']['timbres'][k]['airs']['id'] + '", "target" : "textes_publies__' + j_graph['data']['timbres'][i]['textes_publies']['id'] + '", "color" : "#CFCFCF" }, ')

                }
            }
        }

        if (textes_airs_voisins !== '[') {
            textes_airs_voisins = textes_airs_voisins.substring(0, textes_airs_voisins.length - 2)
            textes_airs_voisins = JSON.parse(textes_airs_voisins + ']')
            for (i = 0; i < textes_airs_voisins.length; i++) {
                // il arrive qu'un texte voisin par l'air soit également un texte voisin par l'édition
                for (k=0; k<textes_voisins.length; k++) {
                    if (textes_voisins[k]['id']!==textes_airs_voisins[i]['id']){
                        res_nodes = res_nodes.concat('{ "id" : "textes_publies__' + textes_airs_voisins[i]['id'] + '", "label" : "' + textes_airs_voisins[i]['titre'] + '", "color" : "' + color[1] + '", "size" : 0.4 }, ') 
                    }
                    break
                }
            }
        }
        res_nodes = res_nodes.substring(0, res_nodes.length - 2)
        res_nodes = res_nodes.concat('], ')

        // EDGES

        // relier les textes et leur édition
        console.log(textes_voisins)

        res_links = res_links.concat('{ "id" : 0, "source" : "textes_publies__' + texte[0]['id'] + '", "target" : "editions__' + texte[0]['edition']['id'] + '", "color" : "#303030" }, ')
        console.log(textes_voisins)
        if (textes_voisins !== '[ ') {
            for (i = 0; i < textes_voisins.length; i++) {
                // id = i+1 car l'id de l'arc reliant notre texte à son édition est déjà à 0
                res_links = res_links.concat('{ "id" : ' + (i+1)+ ', "source" : "textes_publies__' + textes_voisins[i]['id'] + '", "target" : "editions__' + texte[0]['edition']['id'] + '", "color" : "#CFCFCF" }, ')
            }
        }

        // relier le texte à ses airs
        for (i = 0; i < j['data']['timbres'].length; i++) {
            res_links = res_links.concat('{ "id" : "' + j['data']['timbres'][i]['id'] + '", "source" : "airs__' + j['data']['timbres'][i]['airs']['id'] + '", "target" : "textes_publies__' + texte[0]['id'] + '", "color" : "#303030" }, ')
        }

        // relier les textes_airs_voisins à leurs airs
        // fait dans 'les textes liés à ses airs'


        res_links = res_links.substring(0, res_links.length - 2)
        let res = res_nodes + res_links + ']}'
        console.log(JSON.parse(res))

        return JSON.parse(res)
    }

}

export default LocalGraph;
