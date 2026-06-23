import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { MapPin, Search, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Map,
  Marker,
  useMapsLibrary,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";

interface FormLocationSearchProps {
  name: string;
  placeholder?: string;
  error?: string;
  containerClassName?: string;
}

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 };
const MAP_ZOOM = 12;

export function FormLocationSearch({
  name,
  placeholder = "Enter your location",
  error,
  containerClassName,
}: FormLocationSearchProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fieldError = error || (errors[name]?.message as string);
  const currentValue = watch(name);

  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] =
    useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const geocodingLib = useMapsLibrary("geocoding");
  const placesLib = useMapsLibrary("places");

  // Autocomplete service instance for fetching predictions
  const autocompleteService = useMemo(() => {
    if (!placesLib) return null;
    return new placesLib.AutocompleteService();
  }, [placesLib]);

  // Fetch autocomplete predictions as user types
  const fetchSuggestions = useCallback(
    (input: string) => {
      if (!autocompleteService || input.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      autocompleteService.getPlacePredictions(
        {
          input,
          types: ["geocode", "establishment"],
        },
        (predictions) => {
          setIsSearching(false);
          if (predictions) {
            setSuggestions(predictions);
            setShowSuggestions(predictions.length > 0);
            setSelectedSuggestionIndex(-1);
          }
        },
      );
    },
    [autocompleteService],
  );

  // Get place details by placeId and update form + map
  const selectPlace = useCallback(
    (placeId: string, description: string) => {
      setShowSuggestions(false);
      setSuggestions([]);
      setInputValue(description);
      setValue(name, description, { shouldValidate: true });

      const svc = placesServiceRef.current;
      if (!svc) return;

      svc.getDetails(
        {
          placeId,
          fields: ["geometry", "formatted_address"],
        },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || description;

            setInputValue(address);
            setMarkerPosition({ lat, lng });
            setValue(name, address, { shouldValidate: true });

            if (mapRef.current) {
              mapRef.current.setCenter({ lat, lng });
              mapRef.current.setZoom(15);
            }
          }
        },
      );
    },
    [name, setValue],
  );

  // Handle input change — debounce and fetch suggestions
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setValue(name, value, { shouldValidate: false });

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    },
    [name, setValue, fetchSuggestions],
  );

  // Handle keyboard navigation in dropdown
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        const suggestion = suggestions[selectedSuggestionIndex];
        selectPlace(suggestion.place_id, suggestion.description);
        inputRef.current?.blur();
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    },
    [showSuggestions, suggestions, selectedSuggestionIndex, selectPlace],
  );

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync form value into input display (for pre-populated or reset forms)
  useEffect(() => {
    if (typeof currentValue === "string") {
      setInputValue(currentValue);
    }
  }, [currentValue]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Get user's current location via browser geolocation
  const getUserLocation = useCallback((): Promise<google.maps.LatLngLiteral> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });
  }, []);

  // Toggle map: when opening, always try browser geolocation first
  const handleToggleMap = useCallback(async () => {
    if (!showMap) {
      setIsGettingLocation(true);

      try {
        // Always try browser geolocation first
        const pos = await getUserLocation();
        setMarkerPosition(pos);
        setMapCenter(pos);

        // Reverse geocode to fill the location field
        if (geocodingLib) {
          try {
            const geocoder = new geocodingLib.Geocoder();
            const response = await geocoder.geocode({ location: pos });
            if (response.results[0]?.formatted_address) {
              const address = response.results[0].formatted_address;
              setInputValue(address);
              setValue(name, address, { shouldValidate: true });
            }
          } catch {
            // Silently fail
          }
        }
      } catch {
        // Geolocation failed or denied — try geocoding existing form value
        if (currentValue && currentValue.trim() && geocodingLib) {
          try {
            const geocoder = new geocodingLib.Geocoder();
            const response = await geocoder.geocode({ address: currentValue });
            if (response.results[0]?.geometry?.location) {
              const loc = response.results[0].geometry.location;
              const pos = { lat: loc.lat(), lng: loc.lng() };
              setMarkerPosition(pos);
              setMapCenter(pos);
            } else {
              setMapCenter(DEFAULT_CENTER);
            }
          } catch {
            setMapCenter(DEFAULT_CENTER);
          }
        } else {
          // No existing value and geolocation failed — use default
          setMapCenter(DEFAULT_CENTER);
        }
      }

      setIsGettingLocation(false);
    }

    setShowMap((prev) => !prev);
  }, [showMap, currentValue, geocodingLib, getUserLocation, name, setValue]);

  // Reverse geocode a lat/lng to get the formatted address
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      if (!geocodingLib) return;
      try {
        const geocoder = new geocodingLib.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
        if (response.results[0]?.formatted_address) {
          const address = response.results[0].formatted_address;
          setInputValue(address);
          setValue(name, address, { shouldValidate: true });
        }
      } catch {
        // Silently fail
      }
    },
    [geocodingLib, name, setValue],
  );

  // Handle click on the map to drop a marker
  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      const latLng = e.detail.latLng;
      if (!latLng) return;
      setMarkerPosition({ lat: latLng.lat, lng: latLng.lng });
      reverseGeocode(latLng.lat, latLng.lng);
    },
    [reverseGeocode],
  );

  // Handle marker drag end
  const handleDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const latLng = e.latLng;
      if (!latLng) return;
      const lat = latLng.lat();
      const lng = latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode],
  );

  return (
    <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
      <div
        className="flex items-center gap-2 px-4 rounded-full"
        style={{
          background: "#fff0f0",
          border: `1.5px solid ${fieldError ? "#E55F68" : "#fdd0d0"}`,
          height: "44px",
        }}
      >
        <Search className="w-4 h-4 shrink-0" style={{ color: "#f9a8b4" }} />
        <input
          ref={(el) => {
            inputRef.current = el;
          }}
          name={name}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          autoComplete="off"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "#555", fontFamily: "'DM Sans', sans-serif" }}
        />
        {isSearching && (
          <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: "#f9a8b4" }} />
        )}
        <button
          type="button"
          onClick={handleToggleMap}
          disabled={isGettingLocation}
          className="h-8 w-8 bg-brand-400 rounded-full flex items-center justify-center shrink-0 hover:bg-brand-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait"
          title={isGettingLocation ? "Getting your location..." : showMap ? "Hide map" : "Show map"}
        >
          {isGettingLocation ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : showMap ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <MapPin className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {fieldError && (
        <p
          style={{
            fontSize: "12px",
            color: "#E55F68",
            paddingLeft: "4px",
            margin: 0,
          }}
        >
          {fieldError}
        </p>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div ref={dropdownRef} className="relative">
          <div
            className="absolute top-0 left-0 right-0 z-50 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
            style={{ marginTop: "2px" }}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.place_id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectPlace(suggestion.place_id, suggestion.description);
                }}
                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  index === selectedSuggestionIndex
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                  <span>{suggestion.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Map Section */}
      {showMap && (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 mt-1">
          <div style={{ height: "350px", width: "100%" }}>
            <Map
              center={mapCenter}
              defaultZoom={MAP_ZOOM}
              onClick={handleMapClick}
              mapId="location-picker-map"
              onMapReady={(map) => {
                mapRef.current = map;
                // Create PlacesService once the map is available
                if (placesLib && !placesServiceRef.current) {
                  placesServiceRef.current = new placesLib.PlacesService(map);
                }
                if (markerPosition) {
                  map.setCenter(markerPosition);
                  map.setZoom(15);
                }
              }}
            >
              {markerPosition && (
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={handleDragEnd}
                />
              )}
            </Map>
          </div>
        </div>
      )}
    </div>
  );
}
