import React, { useRef, useEffect } from 'react'

const Canvas = props => {

    const canvasRef = useRef(null)

    const coupletBool = (props.json.couplet ? true : false)
    const refrainBool = (props.json.refrain ? true : false)

    const nombreVersCouplet = coupletBool ? props.couplet.versNumber : 0
    const nombreVersRefrain = refrainBool ? props.json.refrain.length : 0

    const jsonCouplet = coupletBool ? props.json['couplet'] : null
    const jsonRefrain = refrainBool ? props.json['refrain'] : null

    const espaceBis = 100
    const largeurStrophe = getWidth() - espaceBis

    function getHeight() {
        if (refrainBool) {
            return 600
        }
        else {
            return 300
        }
    }

    function getWidth() {
        return 700
    }

    const draw = (ctx) => {

        let maxSyllabeCouplet = 0
        let maxSyllabeRefrain = 0
        let maxSyllabe = 0
        var i = 0
        var j = 0
        var k = 0

        if (coupletBool) {
            for (i = 0; i < jsonCouplet.length; i++) {
                if (parseInt(jsonCouplet[i]['metre']) >= maxSyllabeCouplet) {
                    maxSyllabeCouplet = parseInt(jsonCouplet[i]['metre'])
                }
            }
        }
        if (refrainBool) {
            for (i = 0; i < jsonRefrain.length; i++) {
                if (parseInt(jsonRefrain[i]['metre']) >= maxSyllabeRefrain) {
                    maxSyllabeRefrain = parseInt(jsonRefrain[i]['metre'])
                }
            }
            if (maxSyllabeRefrain > maxSyllabeCouplet) {
                maxSyllabe = maxSyllabeRefrain
            }
            else {
                maxSyllabe = maxSyllabeCouplet
            }
        }
        else {
            maxSyllabe = maxSyllabeCouplet
        }

        // Mesures Refrain

        const hauteurStropheRefrain = refrainBool ? 200 : 0
        const espaceCentrerHorizontalRefrain = (2.5 / 100) * largeurStrophe
        const espaceCentrerVerticalRefrain = (2.5 / 100) * hauteurStropheRefrain


        // Mesures Vers Refrain

        const hauteurEntreVersRefrain = (2 / 100) * hauteurStropheRefrain
        const hauteurVersRefrain = hauteurStropheRefrain / nombreVersRefrain - 1.25 * hauteurEntreVersRefrain

        const largeurEntreSyllabesRefrain = (2 / 100) * largeurStrophe
        const largeurSyllabeRefrain = largeurStrophe / maxSyllabe - 1.1 * largeurEntreSyllabesRefrain

        const espaceRefrainCouplet = refrainBool ? 50 : 0

        // Mesures Couplet 

        const hauteurStropheCouplet = 300
        const espaceCentrerHorizontalCouplet = (2.5 / 100) * largeurStrophe
        const espaceCentrerVerticalCouplet = (2.5 / 100) * hauteurStropheCouplet

        // Mesures Vers Couplet 

        const hauteurEntreVersCouplet = (2 / 100) * hauteurStropheCouplet
        const hauteurVersCouplet = hauteurStropheCouplet / nombreVersCouplet - 1.25 * hauteurEntreVersCouplet

        const largeurEntreSyllabesCouplet = (2 / 100) * largeurStrophe
        const largeurSyllabeCouplet = largeurStrophe / maxSyllabe - 1.1 * largeurEntreSyllabesCouplet

        // DESSIN 

        if (refrainBool) {

            // Vers
            for (j = 0; j < nombreVersRefrain; j++) {
                ctx.fillStyle = jsonRefrain[j]['couleur']

                // Syllabes
                for (k = 0; k < jsonRefrain[j]['metre']; k++) {

                    // ctx.shadowColor = '#907963'
                    ctx.shadowBlur = 0;
                    ctx.fillRect(
                        espaceCentrerHorizontalRefrain + k * largeurSyllabeRefrain + k * largeurEntreSyllabesRefrain,
                        espaceCentrerVerticalRefrain + j * hauteurVersRefrain + j * hauteurEntreVersRefrain,
                        largeurSyllabeRefrain,
                        hauteurVersRefrain
                    )
                    // Vers genre
                    if (k === parseInt(jsonRefrain[j]['metre']) - 1 && jsonRefrain[j]['genre'] === 'f') {

                        // genre féminin
                        ctx.beginPath();
                        ctx.fillStyle = 'white'
                        ctx.arc(
                            espaceCentrerHorizontalRefrain + k * largeurSyllabeRefrain + k * largeurEntreSyllabesRefrain + (largeurSyllabeRefrain / 2),
                            espaceCentrerVerticalRefrain + j * hauteurVersRefrain + j * hauteurEntreVersRefrain + (hauteurVersRefrain / 2),
                            3 * (10 / nombreVersRefrain),
                            0,
                            2 * Math.PI
                        )
                        ctx.fill();
                    }
                    if (k === parseInt(jsonRefrain[j]['metre']) - 1 && jsonRefrain[j]['genre'] === 'm') {

                        // genre masculin
                        ctx.beginPath();
                        ctx.fillStyle = 'white'
                        ctx.fillRect(
                            espaceCentrerHorizontalRefrain + k * largeurSyllabeRefrain + k * largeurEntreSyllabesRefrain + (largeurSyllabeRefrain / 2) - ((hauteurVersRefrain / 3) / 2),
                            espaceCentrerVerticalRefrain + j * hauteurVersRefrain + j * hauteurEntreVersRefrain + (hauteurVersRefrain / 3),
                            (hauteurVersRefrain / 3),
                            (hauteurVersRefrain / 3)
                        )
                        ctx.fill();
                    }
                    ctx.fillStyle = jsonRefrain[j]['couleur']
                }

                // Vers bissé
                if (jsonRefrain[j]['bis'] === 'true') {
                    ctx.font = '25px serif';
                    ctx.shadowBlur = 0;
                    ctx.fillText(
                        'bis',
                        620,
                        espaceCentrerVerticalRefrain + (j + 0.6) * hauteurVersRefrain + j * hauteurEntreVersRefrain,
                        50
                    )
                }
            }

        }
        if (coupletBool) {

            // Strophe couplet 
            ctx.fillStyle = '#C3AE9A'
            ctx.shadowColor = 'lightgrey';
            ctx.shadowBlur = 8;
            ctx.fillRect(
                0,                                                      // x
                hauteurStropheRefrain + espaceRefrainCouplet,           // y
                largeurStrophe,                                         // largeur
                hauteurStropheCouplet                                   // hauteur
            )

            // Vers
            for (j = 0; j < nombreVersCouplet; j++) {
                ctx.fillStyle = jsonCouplet[j]['couleur']

                // Syllabes
                for (k = 0; k < jsonCouplet[j]['metre']; k++) {

                    ctx.shadowColor = '#907963'
                    ctx.shadowBlur = 5;
                    ctx.fillRect(
                        espaceCentrerHorizontalCouplet + k * largeurSyllabeCouplet + k * largeurEntreSyllabesCouplet,
                        hauteurStropheRefrain + espaceRefrainCouplet + espaceCentrerVerticalCouplet + j * hauteurVersCouplet + j * hauteurEntreVersCouplet,
                        largeurSyllabeCouplet,
                        hauteurVersCouplet
                    )

                    // Vers genre
                    if (k === parseInt(jsonCouplet[j]['metre']) - 1 && jsonCouplet[j]['genre'] === 'f') {

                        // genre féminin
                        ctx.beginPath();
                        ctx.fillStyle = 'white'
                        ctx.arc(
                            espaceCentrerHorizontalCouplet + k * largeurSyllabeCouplet + k * largeurEntreSyllabesCouplet + (largeurSyllabeCouplet / 2),
                            hauteurStropheRefrain + espaceRefrainCouplet + espaceCentrerVerticalCouplet + j * hauteurVersCouplet + j * hauteurEntreVersCouplet + (hauteurVersCouplet / 2),
                            3 * (10 / nombreVersCouplet),
                            0,
                            2 * Math.PI
                        )
                        ctx.fill();
                    }
                    if (k === parseInt(jsonCouplet[j]['metre']) - 1 && jsonCouplet[j]['genre'] === 'm') {

                        // genre masculin
                        ctx.beginPath();
                        ctx.fillStyle = 'white'
                        ctx.fillRect(
                            espaceCentrerHorizontalCouplet + k * largeurSyllabeCouplet + k * largeurEntreSyllabesCouplet + (largeurSyllabeCouplet / 2) - ((hauteurVersCouplet / 3) / 2),
                            hauteurStropheRefrain + espaceRefrainCouplet + espaceCentrerVerticalCouplet + j * hauteurVersCouplet + j * hauteurEntreVersCouplet + (hauteurVersCouplet / 3),
                            (hauteurVersCouplet / 3),
                            (hauteurVersCouplet / 3)
                        )
                        ctx.fill();
                    }
                    ctx.fillStyle = jsonCouplet[j]['couleur']
                }

                // Vers bissé
                if (jsonCouplet[j]['bis'] === 'true') {
                    ctx.font = '25px serif';
                    ctx.shadowBlur = 0;
                    ctx.fillText(
                        'bis',
                        620,
                        hauteurStropheRefrain + espaceRefrainCouplet + espaceCentrerVerticalCouplet + (j + 0.6) * hauteurVersCouplet + j * hauteurEntreVersCouplet,
                        50
                    )
                }

            }



        }
        
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // le dessin
        draw(ctx)
    }, [draw])

    return <canvas style={{
        border: '1px solid white',
    }} ref={canvasRef} width={getWidth() + 'px'} height={getHeight() + 'px'} {...props} />
}
export default Canvas
