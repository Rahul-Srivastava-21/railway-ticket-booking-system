import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../components/ui/Card";
import FormInput from "../../components/ui/FormInput";
import FormSelect from "../../components/ui/FormSelect";
import Button from "../../components/ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";

function AddTrain() {
  const [formData, setFormData] = useState({
    name: "",
    trainNumber: "",
    routeGroupId: "",
  });
  const [routeGroups, setRouteGroups] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRouteGroups, setLoadingRouteGroups] = useState(true);

  useEffect(() => {
    const fetchRouteGroups = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/route-groups"
        );

        setRouteGroups(response.data.routeGroups);
      } catch (err) {
        setError("Failed to load route groups");
      } finally {
        setLoadingRouteGroups(false);
      }
    };

    fetchRouteGroups();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear any previous messages
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/trains/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Train added successfully!");
      // Clear form
      setFormData({
        name: "",
        trainNumber: "",
        routeGroupId: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add train");
    } finally {
      setLoading(false);
    }
  };

  if (loadingRouteGroups) {
    return (
      <Card>
        <div className="text-center">Loading route groups...</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Add New Train</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter the details for the new train
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Train Name"
          id="name"
          name="name"
          required
          placeholder="Enter train name"
          value={formData.name}
          onChange={handleChange}
        />

        <FormInput
          label="Train Number"
          id="trainNumber"
          name="trainNumber"
          required
          placeholder="Enter train number"
          value={formData.trainNumber}
          onChange={handleChange}
        />

        <FormSelect
          label="Route Group"
          id="routeGroupId"
          name="routeGroupId"
          required
          options={routeGroups.map((group) => ({
            value: group.id,
            label: group.id,
          }))}
          value={formData.routeGroupId}
          onChange={handleChange}
        />

        {error && <ErrorMessage message={error} />}

        {success && (
          <div className="text-green-500 text-sm text-center">{success}</div>
        )}

        <Button type="submit" loading={loading}>
          Add Train
        </Button>
      </form>
    </Card>
  );
}

export default AddTrain;
