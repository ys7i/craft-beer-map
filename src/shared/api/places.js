"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placesApi = exports.PlacesApiClient = void 0;
var dotenv_1 = require("dotenv");
// Load environment variables
dotenv_1.default.config({ path: ".env" });
var API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
var PlacesApiClient = /** @class */ (function () {
    function PlacesApiClient() {
        this.baseUrl = "https://maps.googleapis.com/maps/api/place";
    }
    PlacesApiClient.prototype.transformToRestaurant = function (place) {
        var _a, _b;
        var photoUrl = ((_a = place.photos) === null || _a === void 0 ? void 0 : _a[0])
            ? "".concat(this.baseUrl, "/photo?maxwidth=400&photo_reference=").concat(place.photos[0].photo_reference, "&key=").concat(API_KEY)
            : undefined;
        return {
            id: place.place_id,
            name: place.name,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            address: place.formatted_address || place.vicinity,
            phone: place.formatted_phone_number,
            website: place.website,
            rating: place.rating,
            priceLevel: place.price_level,
            photoUrl: photoUrl,
            openingHours: (_b = place.opening_hours) === null || _b === void 0 ? void 0 : _b.weekday_text,
        };
    };
    PlacesApiClient.prototype.searchRestaurants = function (params, pageToken) {
        return __awaiter(this, void 0, void 0, function () {
            var latitude, longitude, _a, radius, _b, keyword, minRating, searchParams, response, data, restaurants;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!API_KEY) {
                            throw new Error("Google Places API key is not configured");
                        }
                        latitude = params.latitude, longitude = params.longitude, _a = params.radius, radius = _a === void 0 ? 5000 : _a, _b = params.keyword, keyword = _b === void 0 ? "craft beer" : _b, minRating = params.minRating;
                        searchParams = new URLSearchParams({
                            location: "".concat(latitude, ",").concat(longitude),
                            radius: radius.toString(),
                            keyword: keyword,
                            type: "restaurant",
                            key: API_KEY,
                        });
                        if (minRating) {
                            searchParams.append("minprice", "0");
                            searchParams.append("maxprice", "4");
                        }
                        if (pageToken) {
                            searchParams.append("pagetoken", pageToken);
                        }
                        return [4 /*yield*/, fetch("".concat(this.baseUrl, "/nearbysearch/json?").concat(searchParams))];
                    case 1:
                        response = _c.sent();
                        if (!response.ok) {
                            throw new Error("Places API error: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _c.sent();
                        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
                            throw new Error("Places API error: ".concat(data.status));
                        }
                        restaurants = data.results
                            .map(function (place) { return _this.transformToRestaurant(place); })
                            .filter(function (restaurant) {
                            return !minRating || (restaurant.rating && restaurant.rating >= minRating);
                        });
                        return [2 /*return*/, {
                                restaurants: restaurants,
                                nextPageToken: data.next_page_token,
                            }];
                }
            });
        });
    };
    return PlacesApiClient;
}());
exports.PlacesApiClient = PlacesApiClient;
exports.placesApi = new PlacesApiClient();
