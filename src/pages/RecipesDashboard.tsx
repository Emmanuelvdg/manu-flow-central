
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import RecipeMappingModal from '@/components/recipe/RecipeMappingModal';
import { fetchRecipes, deleteRecipe, Recipe } from '@/components/recipe/recipeUtils';

const RecipesDashboard = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchRecipes();
        setRecipes(data);
      } catch (e) {
        setRecipes([]);
      }
      setLoading(false);
    };
    load();
  }, [modalOpen]);

  const columns = [
    {
      header: "#",
      accessorKey: "id",
      cell: (_row: any) => {
        const index = recipes.findIndex(recipe => recipe.id === _row.id);
        return index > -1 ? index + 1 : '—';
      }
    },
    {
      header: "Product",
      accessorKey: "product_name",
      cell: (_row: any) => (
        <span>{_row.product_name} <span className="text-xs text-muted-foreground ml-2">({_row.product_id})</span></span>
      )
    },
    {
      header: "Recipe Name",
      accessorKey: "name"
    },
    {
      header: "Description",
      accessorKey: "description"
    },
    {
      header: "Created",
      accessorKey: "created_at",
      cell: (_row: any) => new Date(_row.created_at).toLocaleDateString()
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (_row: any) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setEditRecipe(_row); setModalOpen(true); }}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={async e => {
            e.stopPropagation();
            if (window.confirm('Delete this recipe mapping?')) {
              await deleteRecipe(_row.id);
              setRecipes(r => r.filter(rec => rec.id !== _row.id));
            }
          }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    // Ignore cost filtering since recipes don't contain cost in this schema
    const matchesSearch = searchTerm === '' ||
      [recipe.product_id, recipe.product_name, recipe.name, recipe.description].some(value =>
        (value || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  const handleClearFilters = () => {
    setMinCost('');
    setMaxCost('');
    setSearchTerm('');
  };

  const handleSearch = () => {
    // No-op, as filters are reactive
  };

  return (
    <MainLayout title="Recipe Management">
      <RecipeMappingModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditRecipe(null); }}
        onSuccess={() => { setModalOpen(false); setEditRecipe(null); }}
        initialRecipe={editRecipe}
      />
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Recipe/Product Mapping</div>
          <div>
            <Button variant="default" onClick={() => { setEditRecipe(null); setModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Mapping
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-md border">
          <div className="p-4 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Input placeholder="Product" />
              <Input placeholder="Recipe Name" />
              <Input placeholder="Description" />
              <Input placeholder="Product ID" />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search"
                className="w-32"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredRecipes}
            // Optionally: onRowClick goes to detail (out of scope for simple mapping)
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default RecipesDashboard;
