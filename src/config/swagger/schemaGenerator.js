import { DataTypes } from 'sequelize';

// Mapeo de tipos Sequelize a tipos OpenAPI
const typeMapping = {
  [DataTypes.STRING.key]: { type: 'string' },
  [DataTypes.TEXT.key]: { type: 'string' },
  [DataTypes.INTEGER.key]: { type: 'integer' },
  [DataTypes.FLOAT.key]: { type: 'number' },
  [DataTypes.DOUBLE.key]: { type: 'number' },
  [DataTypes.DECIMAL.key]: { type: 'number' },
  [DataTypes.BOOLEAN.key]: { type: 'boolean' },
  [DataTypes.DATE.key]: { type: 'string', format: 'date-time' },
  [DataTypes.DATEONLY.key]: { type: 'string', format: 'date' }
};

// Función para generar solo las propiedades del modelo
export const generateModelProperties = (model) => {
  const properties = {
    id: {
      type: 'integer',
      description: `ID del ${model.name.toLowerCase()}`
    }
  };

  // Obtener atributos del modelo
  const attributes = model.rawAttributes;
  for (const [fieldName, field] of Object.entries(attributes)) {
    if (fieldName === 'id') continue;

    const swaggerType = typeMapping[field.type.key] || { type: 'string' };
    properties[fieldName] = {
      ...swaggerType,
      description: field.comment || `${fieldName} del ${model.name.toLowerCase()}`,
      ...(field.enum && { enum: field.values })
    };
  }

  return properties;
};
