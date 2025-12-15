import { NextRequest } from 'next/server';
import McpService from '@/lib/models/McpService';
import dbConnect from '@/lib/db';
import {
  updateServiceSchema,
  idParamSchema,
  serviceResponseSchema,
  type UpdateServiceInput,
} from '@/lib/validations/service';
import {
  parseRequestBody,
  handleMongoError,
  successResponse,
  errorResponse,
} from '@/lib/api-utils';
// GET /api/services/[id] - Get a specific service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Validate ID parameter
    const idValidation = idParamSchema.safeParse({ id: params.id });
    if (!idValidation.success) {
      return errorResponse('Invalid service ID format', 400);
    }

    // Find the service
    const service = await McpService.findById(params.id).lean();
    if (!service) {
      return errorResponse('Service not found', 404, 'NOT_FOUND');
    }

    // Format response
    const formattedService = {
      ...service,
      _id: service._id.toString(),
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    };

    // Validate response format
    serviceResponseSchema.parse(formattedService);

    return successResponse(formattedService, 200, 'Service retrieved successfully');
  } catch (error) {
    console.error(`GET /api/services/${params.id} error:`, error);
    return handleMongoError(error);
  }
}

// PUT /api/services/[id] - Update a service (full update)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Validate ID parameter
    const idValidation = idParamSchema.safeParse({ id: params.id });
    if (!idValidation.success) {
      return errorResponse('Invalid service ID format', 400);
    }

    // Parse and validate request body
    const bodyResult = await parseRequestBody<UpdateServiceInput>(
      request,
      updateServiceSchema
    );
    if (bodyResult.error) {
      return bodyResult.error;
    }

    const updateData = bodyResult.data!;

    // Check if service exists
    const existingService = await McpService.findById(params.id);
    if (!existingService) {
      return errorResponse('Service not found', 404, 'NOT_FOUND');
    }

    // Update the service
    const updatedService = await McpService.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedService) {
      return errorResponse('Service update failed', 500);
    }

    // Format response
    const formattedService = {
      ...updatedService,
      _id: updatedService._id.toString(),
      createdAt: updatedService.createdAt.toISOString(),
      updatedAt: updatedService.updatedAt.toISOString(),
    };

    // Validate response format
    serviceResponseSchema.parse(formattedService);

    return successResponse(formattedService, 200, 'Service updated successfully');
  } catch (error) {
    console.error(`PUT /api/services/${params.id} error:`, error);
    return handleMongoError(error);
  }
}

// PATCH /api/services/[id] - Update a service (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Validate ID parameter
    const idValidation = idParamSchema.safeParse({ id: params.id });
    if (!idValidation.success) {
      return errorResponse('Invalid service ID format', 400);
    }

    // Parse and validate request body
    const bodyResult = await parseRequestBody<UpdateServiceInput>(
      request,
      updateServiceSchema
    );
    if (bodyResult.error) {
      return bodyResult.error;
    }

    const updateData = bodyResult.data!;

    // Check if service exists
    const existingService = await McpService.findById(params.id);
    if (!existingService) {
      return errorResponse('Service not found', 404, 'NOT_FOUND');
    }

    // Update the service (partial update)
    const updatedService = await McpService.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedService) {
      return errorResponse('Service update failed', 500);
    }

    // Format response
    const formattedService = {
      ...updatedService,
      _id: updatedService._id.toString(),
      createdAt: updatedService.createdAt.toISOString(),
      updatedAt: updatedService.updatedAt.toISOString(),
    };

    // Validate response format
    serviceResponseSchema.parse(formattedService);

    return successResponse(formattedService, 200, 'Service updated successfully');
  } catch (error) {
    console.error(`PATCH /api/services/${params.id} error:`, error);
    return handleMongoError(error);
  }
}

// DELETE /api/services/[id] - Delete a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Validate ID parameter
    const idValidation = idParamSchema.safeParse({ id: params.id });
    if (!idValidation.success) {
      return errorResponse('Invalid service ID format', 400);
    }

    // Check if service exists
    const existingService = await McpService.findById(params.id);
    if (!existingService) {
      return errorResponse('Service not found', 404, 'NOT_FOUND');
    }

    // Delete the service
    const deletedService = await McpService.findByIdAndDelete(params.id);
    if (!deletedService) {
      return errorResponse('Service deletion failed', 500);
    }

    // Format response
    const formattedService = {
      ...deletedService.toObject(),
      _id: deletedService._id.toString(),
      createdAt: deletedService.createdAt.toISOString(),
      updatedAt: deletedService.updatedAt.toISOString(),
    };

    return successResponse(
      { deletedService: formattedService },
      200,
      'Service deleted successfully'
    );
  } catch (error) {
    console.error(`DELETE /api/services/${params.id} error:`, error);
    return handleMongoError(error);
  }
}