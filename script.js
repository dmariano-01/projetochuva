const mediasChuva = [
      { mes: "Janeiro", chuva: 98.56 },
      { mes: "Fevereiro", chuva: 122.12 },
      { mes: "Março", chuva: 223.02 },
      { mes: "Abril", chuva: 203.57 },
      { mes: "Maio", chuva: 109.69 },
      { mes: "Junho", chuva: 38.04 },
      { mes: "Julho", chuva: 14.30 },
      { mes: "Agosto", chuva: 2.15 },
      { mes: "Setembro", chuva: 0.98 },
      { mes: "Outubro", chuva: 2.55 },
      { mes: "Novembro", chuva: 5.12 },
      { mes: "Dezembro", chuva: 16.71 }
    ];

    let grafico = null;

    function mostrarResultados() {
      const area = parseFloat(document.getElementById('area').value);
      const consumoMensal = parseFloat(document.getElementById('consumo').value);
      const coeficiente = parseFloat(document.getElementById('coeficiente').value);

      if (isNaN(area) || isNaN(consumoMensal) || area <= 0 || consumoMensal <= 0) {
        alert("Por favor, insira valores válidos!");
        return;
      }

      let producaoAcumulada = 0;
      let consumoAcumulado = 0;
      let menorSaldo = 0;
      let maiorSaldo = 0;
      let totalCaptado = 0;
      let tabelaHTML = '';
      let saldos = [];

      mediasChuva.forEach((mesData) => {
        const volumeCaptado = (mesData.chuva * area * coeficiente) / 1000;
        totalCaptado += volumeCaptado;

        producaoAcumulada += volumeCaptado;
        consumoAcumulado += consumoMensal;

        const saldo = producaoAcumulada - consumoAcumulado;
        saldos.push(saldo);

        if (saldo < menorSaldo) menorSaldo = saldo;
        if (saldo > maiorSaldo) maiorSaldo = saldo;

        tabelaHTML += `
          <tr>
            <td>${mesData.mes}</td>
            <td>${mesData.chuva.toFixed(2)}</td>
            <td>${volumeCaptado.toFixed(2)}</td>
            <td>${producaoAcumulada.toFixed(2)}</td>
            <td>${saldo.toFixed(2)}</td>
          </tr>`;
      });

      document.getElementById('tabela-resultados').innerHTML = tabelaHTML;

      let volumeNecessario = menorSaldo < 0 ? Math.abs(menorSaldo) : maiorSaldo;
      const volumeRecomendado = volumeNecessario * 1.2;
      const custo = volumeRecomendado * 1500;
      const economiaAnual = totalCaptado * 10;

      document.getElementById('volume-necessario').textContent = volumeNecessario.toFixed(2);
      document.getElementById('volume-recomendado').textContent = volumeRecomendado.toFixed(2);
      document.getElementById('custo').textContent = custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      document.getElementById('economia').textContent = economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

      if (grafico) grafico.destroy();

      const ctx = document.getElementById('graficoCisterna').getContext('2d');
      grafico = new Chart(ctx, {
        type: 'line',
        data: {
          labels: mediasChuva.map(m => m.mes),
          datasets: [{
            label: 'Saldo da Cisterna (m³)',
            data: saldos,
            borderColor: '#1565c0',
            backgroundColor: 'rgba(21,101,192,0.2)',
            fill: true,
            tension: 0.3
          }]
        },
        options: { responsive: true }
      });

      document.getElementById('tela-formulario').classList.add('hidden');
      document.getElementById('tela-resultados').classList.remove('hidden');
    }

    function voltar() {
      document.getElementById('tela-formulario').classList.remove('hidden');
      document.getElementById('tela-resultados').classList.add('hidden');
    }

    function preencherExemplo() {
      document.getElementById('area').value = 4757.32;
      document.getElementById('consumo').value = 180;
      document.getElementById('coeficiente').value = 0.8;
    }