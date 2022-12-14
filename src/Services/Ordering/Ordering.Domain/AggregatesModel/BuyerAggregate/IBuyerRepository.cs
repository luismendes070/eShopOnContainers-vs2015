using Microsoft.eShopOnContainers.Services.Ordering.Domain.Seedwork;
using Microsoft.eShopOnContainers.Services.Ordering.Domain.AggregatesModel.BuyerAggregate;
using System.Threading.Tasks;

namespace Microsoft.eShopOnContainers.Services.Ordering.Domain.AggregatesModel.BuyerAggregate
{
    //This is just the RepositoryContracts or Interface defined at the Domain Layer
    //as requisite for the Buyer Aggregate
    public interface IBuyerRepository
        :IAggregateRepository
    {
        Buyer Add(Buyer buyer);

        Task<Buyer> FindAsync(string BuyerIdentityGuid);
    }
}
