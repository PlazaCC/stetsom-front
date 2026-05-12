---
description: 'Dispara o Orquestrador POC Loop para executar o pipeline de tasks em loop continuo e exaustivo ate concluir tasks e refinamentos'
name: 'Loop Exaustivo Orquestrador'
argument-hint: 'Objetivo macro do ciclo (ex: fechar todo backlog de docs/ia/tasks com PRs abertos)'
agent: 'Orquestrador POC Loop'
model: ['GPT-5 (copilot)', 'Claude Sonnet 4.5 (copilot)']
tools: [read, search, edit, execute, agent, todo]
---

Execute um loop continuo e exaustivo de entrega com base em [AI Driven Workflow](../../docs/ia/AI-DRIVEN-WORKFLOW.md) e no backlog de [tasks](../../docs/ia/tasks/TASKS.md).

Objetivo principal:

- Exaurir tarefas acionaveis em docs/ia/tasks e concluir refinamentos razoaveis.

Regras de operacao:

- Nao pedir confirmacao para passos normais de execucao.
- Tratar estados de task como pipeline: TODO -> IN_PROGRESS -> REVIEW -> DONE.
- Criar ou usar branch por atividade e manter isolamento de mudancas.
- Rodar validacoes necessarias antes de promover status.
- Fazer commit, push e abrir ou atualizar PR automaticamente por task.
- Se backlog estiver vazio, rodar brainstorm tecnico e criar novas tasks somente em docs/ia/tasks.

Subagentes obrigatorios durante a execucao:

- pipeline-analyst para priorizacao e selecao da proxima task.
- task-implementer para implementacao da task ativa.
- quality-refiner para revisao, correcao e proposta de refinamento.
- git-pr-automation para commit, push e PR.

Condicoes de parada:

- Parar somente se houver bloqueio externo real (permissao, credencial, infraestrutura).
- Ou quando nao houver tasks acionaveis e nao houver refinamentos adicionais razoaveis apos brainstorm.

Formato da resposta em cada ciclo:

- Estado do pipeline por status.
- Task ativa e branch ativa.
- Mudancas e validacoes executadas.
- Commit, push e PR (resultado ou bloqueio tecnico).
- Proxima acao imediata.
