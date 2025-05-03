async function processMatrix() {
    const matrixInput = document.getElementById('matrixInput').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "Procesando...";

    try {
        console.log("matrixInput:", matrixInput);
        let parsedMatrix = JSON.parse(matrixInput);
        console.log("parsedMatrix:", parsedMatrix);
        let stringJsonInput = JSON.stringify(parsedMatrix);
        console.log("stringJsonInput: ", stringJsonInput);

        // Primera solicitud: API de rotación
        const rotationResponse = await fetch('http://reto-interseguro-go-env.eba-ky4nqabk.us-west-1.elasticbeanstalk.com/qr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: stringJsonInput
        });

        if (!rotationResponse.ok) {
            throw new Error('Error al comunicarse con la API de rotación');
        }

        const rotationData = await rotationResponse.json();
        console.log("rotationData:", rotationData);

        // Validar que rotationData contiene los datos esperados
        if (!rotationData.Rotatedmatriz || !rotationData.Qmatriz || !rotationData.Rmatriz) {
            throw new Error("Datos incompletos o inválidos recibidos de la API de rotación");
        }

        // Segunda solicitud: API de análisis
        const analysisResponse = await fetch('http://reto-interseguro-node-env-2.eba-933y4irh.us-west-1.elasticbeanstalk.com/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rotated: rotationData.Rotatedmatriz,
                Q: rotationData.Qmatriz,
                R: rotationData.Rmatriz
            })
        });
        if (!analysisResponse.ok) {
            throw new Error('Error al comunicarse con la API de análisis');
        }

        const analysisData = await analysisResponse.json();
        console.log("analysisData:", analysisData);

        // Mostrar resultados en la página
        resultsDiv.innerHTML = `
        <div>
            <h3>Resultados:</h3>
            <p><strong>Matriz Rotada:</strong></p>
            <pre>${JSON.stringify(analysisData.Rotatedmatriz, null, 2)}</pre>
            <p><strong>Estadísticas de Q:</strong></p>
            <pre>${JSON.stringify(analysisData.QStats, null, 2)}</pre>
            <p><strong>Estadísticas de R:</strong></p>
            <pre>${JSON.stringify(analysisData.RStats, null, 2)}</pre>
            <p><strong>Matriz Q:</strong></p>
            <pre>${JSON.stringify(analysisData.Qmatriz, null, 2)}</pre>
            <p><strong>Matriz R:</strong></p>
            <pre>${JSON.stringify(analysisData.Rmatriz, null, 2)}</pre>
        </div>
        `;
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}