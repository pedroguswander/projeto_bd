import { useTotaisPorGenero } from '../hooks/useTotalPorGenero';

const TotalPorGenero = () => {
  const { data, isLoading, isError } = useTotaisPorGenero();

  if (isLoading) return <p>Carregando totais por gênero...</p>;
  if (isError) return <p>Erro ao carregar os totais por gênero</p>;

  return (
    <div className="dashboard-card card-small">
      <h3>Totais por Gênero</h3>
      <p>Homens: {data.Masculino || 0}</p>
      <p>Mulheres: {data.Feminino || 0}</p>
    </div>
  );
};

export default TotalPorGenero;
