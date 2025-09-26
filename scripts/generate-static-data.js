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
exports.generateStaticData = generateStaticData;
var fs_1 = require("fs");
var path_1 = require("path");
var places_1 = require("../src/shared/api/places");
var OUTPUT_DIR = path_1.default.join(__dirname, "../public/data/restaurants");
// 都道府県の主要都市座標
var PREFECTURE_CENTERS = {
    北海道: { lat: 43.0642, lng: 141.3469, code: "hokkaido" },
    青森県: { lat: 40.8244, lng: 140.7402, code: "aomori" },
    岩手県: { lat: 39.7036, lng: 141.1527, code: "iwate" },
    宮城県: { lat: 38.2682, lng: 140.8719, code: "miyagi" },
    秋田県: { lat: 39.7186, lng: 140.1024, code: "akita" },
    山形県: { lat: 38.2404, lng: 140.3633, code: "yamagata" },
    福島県: { lat: 37.7503, lng: 140.4676, code: "fukushima" },
    茨城県: { lat: 36.3418, lng: 140.4467, code: "ibaraki" },
    栃木県: { lat: 36.5657, lng: 139.8836, code: "tochigi" },
    群馬県: { lat: 36.3911, lng: 139.0608, code: "gunma" },
    埼玉県: { lat: 35.8617, lng: 139.6455, code: "saitama" },
    千葉県: { lat: 35.6074, lng: 140.1065, code: "chiba" },
    東京都: { lat: 35.6762, lng: 139.6503, code: "tokyo" },
    神奈川県: { lat: 35.4478, lng: 139.6425, code: "kanagawa" },
    新潟県: { lat: 37.9026, lng: 139.0234, code: "niigata" },
    富山県: { lat: 36.6959, lng: 137.2114, code: "toyama" },
    石川県: { lat: 36.5944, lng: 136.6256, code: "ishikawa" },
    福井県: { lat: 36.0652, lng: 136.2217, code: "fukui" },
    山梨県: { lat: 35.6642, lng: 138.5684, code: "yamanashi" },
    長野県: { lat: 36.6513, lng: 138.181, code: "nagano" },
    岐阜県: { lat: 35.3912, lng: 136.7223, code: "gifu" },
    静岡県: { lat: 34.9756, lng: 138.3829, code: "shizuoka" },
    愛知県: { lat: 35.1802, lng: 136.9066, code: "aichi" },
    三重県: { lat: 34.7303, lng: 136.5086, code: "mie" },
    滋賀県: { lat: 35.0045, lng: 135.8686, code: "shiga" },
    京都府: { lat: 35.0116, lng: 135.7681, code: "kyoto" },
    大阪府: { lat: 34.6937, lng: 135.5023, code: "osaka" },
    兵庫県: { lat: 34.6913, lng: 135.183, code: "hyogo" },
    奈良県: { lat: 34.6851, lng: 135.8048, code: "nara" },
    和歌山県: { lat: 34.2261, lng: 135.1675, code: "wakayama" },
    鳥取県: { lat: 35.5036, lng: 134.238, code: "tottori" },
    島根県: { lat: 35.4723, lng: 133.0505, code: "shimane" },
    岡山県: { lat: 34.6617, lng: 133.9349, code: "okayama" },
    広島県: { lat: 34.3853, lng: 132.4553, code: "hiroshima" },
    山口県: { lat: 34.1861, lng: 131.4707, code: "yamaguchi" },
    徳島県: { lat: 34.0658, lng: 134.5592, code: "tokushima" },
    香川県: { lat: 34.3401, lng: 134.0434, code: "kagawa" },
    愛媛県: { lat: 33.8416, lng: 132.7657, code: "ehime" },
    高知県: { lat: 33.5597, lng: 133.5311, code: "kochi" },
    福岡県: { lat: 33.6064, lng: 130.4183, code: "fukuoka" },
    佐賀県: { lat: 33.2494, lng: 130.2989, code: "saga" },
    長崎県: { lat: 32.7503, lng: 129.8777, code: "nagasaki" },
    熊本県: { lat: 32.7898, lng: 130.7417, code: "kumamoto" },
    大分県: { lat: 33.2382, lng: 131.6126, code: "oita" },
    宮崎県: { lat: 31.9077, lng: 131.4202, code: "miyazaki" },
    鹿児島県: { lat: 31.5602, lng: 130.5581, code: "kagoshima" },
    沖縄県: { lat: 26.2124, lng: 127.6792, code: "okinawa" },
};
function delay(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
function fetchRestaurantsForPrefecture(prefecture, center) {
    return __awaiter(this, void 0, void 0, function () {
        var allRestaurants, nextPageToken, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Fetching restaurants for ".concat(prefecture, "..."));
                    allRestaurants = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, places_1.placesApi.searchRestaurants({
                            latitude: center.lat,
                            longitude: center.lng,
                            radius: 15000,
                            keyword: "クラフトビール専門店",
                        }, nextPageToken)];
                case 2:
                    result = _a.sent();
                    allRestaurants.push.apply(allRestaurants, result.restaurants);
                    nextPageToken = result.nextPageToken;
                    console.log("Found ".concat(result.restaurants.length, " restaurants for ").concat(prefecture, " (total: ").concat(allRestaurants.length, ")"));
                    if (!nextPageToken) return [3 /*break*/, 4];
                    return [4 /*yield*/, delay(2000)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error fetching data for ".concat(prefecture, ":"), error_1);
                    return [3 /*break*/, 7];
                case 6:
                    if (nextPageToken) return [3 /*break*/, 1];
                    _a.label = 7;
                case 7: return [2 /*return*/, {
                        prefecture: prefecture,
                        prefectureCode: center.code,
                        center: { lat: center.lat, lng: center.lng },
                        restaurants: allRestaurants,
                        lastUpdated: new Date().toISOString(),
                        count: allRestaurants.length,
                    }];
            }
        });
    });
}
function generateStaticData() {
    return __awaiter(this, void 0, void 0, function () {
        var results, _i, _a, _b, prefecture, center, data, filePath, error_2, summary, summaryPath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!fs_1.default.existsSync(OUTPUT_DIR)) {
                        fs_1.default.mkdirSync(OUTPUT_DIR, { recursive: true });
                    }
                    results = {};
                    _i = 0, _a = Object.entries(PREFECTURE_CENTERS);
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    _b = _a[_i], prefecture = _b[0], center = _b[1];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetchRestaurantsForPrefecture(prefecture, center)];
                case 3:
                    data = _c.sent();
                    filePath = path_1.default.join(OUTPUT_DIR, "".concat(center.code, ".json"));
                    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
                    results[prefecture] = data.count;
                    console.log("Saved ".concat(data.count, " restaurants to ").concat(center.code, ".json"));
                    return [4 /*yield*/, delay(1000)];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _c.sent();
                    console.error("Failed to process ".concat(prefecture, ":"), error_2);
                    results[prefecture] = 0;
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    summary = {
                        lastUpdated: new Date().toISOString(),
                        totalPrefectures: Object.keys(PREFECTURE_CENTERS).length,
                        results: results,
                    };
                    summaryPath = path_1.default.join(OUTPUT_DIR, "summary.json");
                    fs_1.default.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
                    console.log("Static data generation completed");
                    return [2 /*return*/, results];
            }
        });
    });
}
if (require.main === module) {
    generateStaticData()
        .then(function (results) {
        console.log("Generation completed:", results);
        process.exit(0);
    })
        .catch(function (error) {
        console.error("Generation failed:", error);
        process.exit(1);
    });
}
