import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProperty } from "../../services/propertyService";

const PropertyDetail = () => {
    const { propertyId } = useParams();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await getProperty(propertyId);
                setProperty(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to load property."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [propertyId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-[#815854] font-medium text-sm animate-pulse">
                    Loading property details...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-800 rounded-r-lg text-sm font-medium my-4 shadow-sm">
                {error}
            </div>
        );
    }

    if (!property) {
        return (
            <div className="p-6 bg-[#F9EBDE] border border-[#815854]/20 rounded-xl text-center text-[#815854] my-4 font-medium">
                Property not found.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8 space-y-4">
            {/* Navigation Header */}
            <div className="flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <Link
                    to="/properties"
                    className="text-xs font-semibold text-[#815854]/80 hover:text-[#815854] flex items-center gap-1 transition-colors"
                >
                    &larr; Back to Properties
                </Link>

                <Link
                    to={`/properties/${propertyId}/edit`}
                    className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-4 py-2 rounded-md text-xs shadow-sm transition-all"
                >
                    Edit Property
                </Link>
            </div>

            {/* Main Details Card */}
            <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl p-5 sm:p-6 shadow-sm space-y-6">
                {/* Title */}
                <div className="border-b border-[#815854]/15 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#815854]">
                        {property.name}
                    </h2>
                </div>

                {/* Details Section Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#815854]">
                    <div className="bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Address
                        </span>
                        <p className="font-medium text-[#815854]">{property.address}</p>
                    </div>

                    <div className="bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Location
                        </span>
                        <p className="font-medium text-[#815854]">{property.location}</p>
                    </div>

                    <div className="sm:col-span-2 bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Description
                        </span>
                        <p className="font-medium text-[#815854] leading-relaxed">
                            {property.description || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Features Section */}
                <div>
                    <h3 className="font-semibold text-sm sm:text-base text-[#815854] mb-2.5">
                        Features & Amenities
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {property.features?.length ? (
                            property.features.map((feature) => (
                                <span
                                    key={feature}
                                    className="bg-white border border-[#815854]/20 text-[#815854] px-3 py-1 rounded-full text-xs font-medium shadow-xs"
                                >
                                    {feature}
                                </span>
                            ))
                        ) : (
                            <p className="text-xs text-[#815854]/60 italic">
                                No features added.
                            </p>
                        )}
                    </div>
                </div>

                {/* Associated Units Section */}
                <div className="pt-2 border-t border-[#815854]/15">
                    <h3 className="text-sm sm:text-base font-semibold text-[#815854] mb-3">
                        Units
                    </h3>

                    {property.units?.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {property.units.map((unit) => (
                                <div
                                    key={unit.id}
                                    className="bg-white border border-[#815854]/20 rounded-lg p-3.5 shadow-xs space-y-1 text-xs"
                                >
                                    <div className="flex justify-between items-center mb-1 border-b border-[#815854]/10 pb-1">
                                        <span className="font-bold text-[#815854] text-sm">
                                            Unit {unit.unit_number}
                                        </span>
                                        <span className="bg-[#815854]/10 text-[#815854] px-2 py-0.5 rounded text-[10px] font-semibold">
                                            {unit.unit_type}
                                        </span>
                                    </div>
                                    <p className="text-[#815854]/80">
                                        <strong className="text-[#815854]">Monthly Rent:</strong> ₹{unit.monthly_rent}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-[#815854]/60 italic">
                            No units added to this property yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;