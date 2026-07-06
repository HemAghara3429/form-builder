<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    protected array $allowedOrigins = [
        'http://localhost:4200', //frontend angular application url.
        'http://localhost:3000',
        'http://127.0.0.1:4200',
    ];

    //every request pass through this middleware .this method before it reaches your controller.

    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->headers->get('Origin');//read the incoming request header.

        //handle preflight requests (OPTIONS).
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 204);
            return $this->addCorsHeaders($response, $origin);
        }

        $response = $next($request);
        return $this->addCorsHeaders($response, $origin);
    }


    //cors header add for the request.this method is used to add the cors header for the request.
    //this method is called only for the non-option request.
    private function addCorsHeaders(Response $response, ?string $origin): Response
    {
        //here check the origin is in the allowedOrigins array or not.
        //if the origin is in the allowedOrigins array then set the Access-Control-Allow-Origin header to the origin.
        if ($origin && in_array($origin, $this->allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } else {

            $response->headers->set('Access-Control-Allow-Origin', '*');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400');

        return $response;
    }
}
