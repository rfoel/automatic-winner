init()
  .then(response => {
    const { request_fields, user_fields } = response;

    const stepsData = [
      {
        fields: request_fields,
        title: "Explique o que você precisa",
        subtitle: "Peça orçamento grátis, online!",
        buttonText: "buscar profissionais",
        active: true
      },
      {
        fields: user_fields,
        title: "Estamos quase lá",
        subtitle:
          "Não perca tempo ligando para vários profissionais. Preencha os dados abaixo e nós encontraremos os melhores pra você!",
        buttonText: "finalizar",
        active: false
      },
      {
        title: "Solicitação enviada com sucesso!",
        subtitle: "Em breve enviaremos os melhores profissionais para você!",
        active: false
      }
    ];

    const steps = stepsData.map(step => new ninjaForm.Step(step));

    const container = document.querySelector(".container");

    for (const step of steps) {
      container.appendChild(step.element);
    }
  })
  .catch(error => console.log(error));

async function init() {
  const result = await fetch("http://localhost:3000/fields")
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .then(response => response);

  return result._embedded;
}
