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
var mongoose_1 = require("mongoose");
var category_schema_1 = require("../src/schemas/category.schema");
function createOrthopedicsSubcategories() {
    return __awaiter(this, void 0, void 0, function () {
        var orthopedicsCategory, subcategories, _i, subcategories_1, subcategory, newSubcategory, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    // Connect to MongoDB
                    return [4 /*yield*/, (0, mongoose_1.connect)(process.env.MONGODB_URI || 'mongodb+srv://your_mongodb_url')];
                case 1:
                    // Connect to MongoDB
                    _a.sent();
                    console.log('Connected to MongoDB');
                    return [4 /*yield*/, category_schema_1.Category.findOne({ name: 'Orthopedics' }).exec()];
                case 2:
                    orthopedicsCategory = _a.sent();
                    if (!orthopedicsCategory) {
                        throw new Error('Orthopedics category not found');
                    }
                    subcategories = [
                        {
                            name: 'Cervical Spine Problems',
                            description: 'კისრის მალების პრობლემები',
                            parentId: orthopedicsCategory._id,
                            level: 1,
                            sequence: "".concat(orthopedicsCategory.sequence || '1', ".1"),
                            isActive: true,
                        },
                        {
                            name: 'Thoracic Spine Problems',
                            description: 'გულმკერდის მალების პრობლემები',
                            parentId: orthopedicsCategory._id,
                            level: 1,
                            sequence: "".concat(orthopedicsCategory.sequence || '1', ".2"),
                            isActive: true,
                        },
                        {
                            name: 'Lumbar Spine Problems',
                            description: 'წელის მალების პრობლემები',
                            parentId: orthopedicsCategory._id,
                            level: 1,
                            sequence: "".concat(orthopedicsCategory.sequence || '1', ".3"),
                            isActive: true,
                        },
                        {
                            name: 'Upper Limb Problems',
                            description: 'ზედა კიდურების პრობლემები',
                            parentId: orthopedicsCategory._id,
                            level: 1,
                            sequence: "".concat(orthopedicsCategory.sequence || '1', ".4"),
                            isActive: true,
                        },
                        {
                            name: 'Lower Limb Problems',
                            description: 'ქვედა კიდურების პრობლემები',
                            parentId: orthopedicsCategory._id,
                            level: 1,
                            sequence: "".concat(orthopedicsCategory.sequence || '1', ".5"),
                            isActive: true,
                        },
                        {
                            name: 'Posture Problems',
                            description: 'პოსტურის პრობლემები',
                            parentId: orthopedicsCategory._id,
                            level: 1,
                            sequence: "".concat(orthopedicsCategory.sequence || '1', ".6"),
                            isActive: true,
                        },
                    ];
                    _i = 0, subcategories_1 = subcategories;
                    _a.label = 3;
                case 3:
                    if (!(_i < subcategories_1.length)) return [3 /*break*/, 6];
                    subcategory = subcategories_1[_i];
                    newSubcategory = new category_schema_1.Category(subcategory);
                    return [4 /*yield*/, newSubcategory.save()];
                case 4:
                    _a.sent();
                    console.log("Created subcategory: ".concat(subcategory.name));
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log('All subcategories created successfully');
                    process.exit(0);
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
createOrthopedicsSubcategories();
