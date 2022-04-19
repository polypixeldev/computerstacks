import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';

declare global {
	var mongoose: typeof mongoose,
	var prisma: PrismaClient
};