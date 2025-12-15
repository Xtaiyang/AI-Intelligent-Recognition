import { NextRequest } from 'next/server';
import McpService from '@/lib/models/McpService';
import dbConnect from '@/lib/db';
import {
  createServiceSchema,
  serviceQuerySchema,
  serviceResponseSchema,
  servicesListResponseSchema,
  type CreateServiceInput,
  type ServiceQuery,
  type ServiceResponse,
} from '@/lib/validations/service';
import {
  parseQueryParams,
  parseRequestBody,
  getPaginationParams,
  buildServiceFilter,
  successResponse,
  createdResponse,
  handleMongoError,
  errorResponse,
} from '@/lib/api-utils';

// GET /api/services - List services with pagination, filtering, and search
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Parse and validate query parameters
    const queryResult = parseQueryParams<ServiceQuery>(request, serviceQuerySchema);
    if (queryResult.error) {
      return queryResult.error;
    }

    const { category, search, page, limit } = queryResult.data!;
    const { skip, take } = getPaginationParams(page, limit);

    // Build filter
    const filter = buildServiceFilter(category, search);

    // Get services and total count
    const [services, totalCount] = await Promise.all([
      McpService.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take)
        .lean(),
      McpService.countDocuments(filter),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Format response
    const formattedServices = services.map(service => ({
      ...service,
      _id: service._id.toString(),
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    }));

    const responseData = {
      services: formattedServices,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
      },
    };

    // Validate response format
    servicesListResponseSchema.parse(responseData);

    return successResponse(responseData, 200, 'Services retrieved successfully');
  } catch (error) {
    console.error('GET /api/services error:', error);
    return handleMongoError(error);
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Parse and validate request body
    const bodyResult = await parseRequestBody<CreateServiceInput>(
      request,
      createServiceSchema
    );
    if (bodyResult.error) {
      return bodyResult.error;
    }

    const serviceData = bodyResult.data!;

    // Create the service
    const newService = await McpService.create(serviceData);

    // Format response
    const formattedService = {
      ...newService.toObject(),
      _id: newService._id.toString(),
      createdAt: newService.createdAt.toISOString(),
      updatedAt: newService.updatedAt.toISOString(),
    };

    // Validate response format
    serviceResponseSchema.parse(formattedService);

    return createdResponse(formattedService, 'Service created successfully');
  } catch (error) {
    console.error('POST /api/services error:', error);
    return handleMongoError(error);
  }
}