/**
 * Objetivos de Desenvolvimento Sustentável da Agenda 2030 da ONU.
 * Nomes e cores oficiais; os programas do PPA citam os ODS no Anexo II.
 */
export const ods: Record<string, { nome: string; cor: string }> = {
  'ODS 1': { nome: 'Erradicação da pobreza', cor: '#E5243B' },
  'ODS 2': { nome: 'Fome zero e agricultura sustentável', cor: '#DDA63A' },
  'ODS 3': { nome: 'Saúde e bem-estar', cor: '#4C9F38' },
  'ODS 4': { nome: 'Educação de qualidade', cor: '#C5192D' },
  'ODS 5': { nome: 'Igualdade de gênero', cor: '#FF3A21' },
  'ODS 6': { nome: 'Água potável e saneamento', cor: '#26BDE2' },
  'ODS 7': { nome: 'Energia limpa e acessível', cor: '#FCC30B' },
  'ODS 8': { nome: 'Trabalho decente e crescimento econômico', cor: '#A21942' },
  'ODS 9': { nome: 'Indústria, inovação e infraestrutura', cor: '#FD6925' },
  'ODS 10': { nome: 'Redução das desigualdades', cor: '#DD1367' },
  'ODS 11': { nome: 'Cidades e comunidades sustentáveis', cor: '#FD9D24' },
  'ODS 12': { nome: 'Consumo e produção responsáveis', cor: '#BF8B2E' },
  'ODS 13': { nome: 'Ação contra a mudança global do clima', cor: '#3F7E44' },
  'ODS 14': { nome: 'Vida na água', cor: '#0A97D9' },
  'ODS 15': { nome: 'Vida terrestre', cor: '#56C02B' },
  'ODS 16': { nome: 'Paz, justiça e instituições eficazes', cor: '#00689D' },
  'ODS 17': { nome: 'Parcerias e meios de implementação', cor: '#19486A' },
};

export const odsInfo = (codigo: string) => ods[codigo];
