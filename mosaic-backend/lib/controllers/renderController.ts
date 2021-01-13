import { Request, Response } from 'express';
import RenderService from '../modules/render/service';

export class RenderController {

    private render_service: RenderService = new RenderService();

    public render_mosaic (req: Request, res: Response, next: any) {
        this.render_service.renderMosaic(req, res, next);
    }
}